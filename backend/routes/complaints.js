import express from 'express';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import db from '../db/database.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configure multer for memory storage (required for Vercel Serverless)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Create a complaint
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { title, description, category, location } = req.body;
    const userId = req.user.id;
    let imagePath = null;

    if (!title || !description || !category || !location) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (req.file) {
      const fileName = `${Date.now()}-${req.file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const { data: uploadData, error: uploadError } = await db.storage
        .from('complaints')
        .upload(fileName, req.file.buffer, {
          contentType: req.file.mimetype,
        });

      if (uploadError) {
        console.error('Upload Error:', uploadError);
        return res.status(500).json({ error: 'Failed to upload image to storage' });
      }

      const { data: urlData } = db.storage.from('complaints').getPublicUrl(fileName);
      imagePath = urlData.publicUrl;
    }

    const { data, error } = await db
      .from('complaints')
      .insert([{ user_id: userId, title, description, category, location, image_path: imagePath }])
      .select();

    if (error) {
      console.error('DB Insert Error:', error);
      return res.status(500).json({ error: 'Failed to create complaint', details: error.message || error });
    }

    res.status(201).json({ id: data[0].id, message: 'Complaint created successfully' });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all complaints (admin) or user's complaints (citizen)
router.get('/', authMiddleware, async (req, res) => {
  try {
    let query = db
      .from('complaints')
      .select('*, users(name, email)')
      .order('created_at', { ascending: false });

    if (req.user.role === 'citizen') {
      query = query.eq('user_id', req.user.id);
    }

    const { data, error } = await query;

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch complaints' });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get a single complaint
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const complaintId = req.params.id;

    const { data: complaint, error } = await db
      .from('complaints')
      .select('*')
      .eq('id', complaintId)
      .single();

    if (error || !complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    // Check authorization
    if (req.user.role === 'citizen' && complaint.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Fetch updates
    const { data: updates } = await db
      .from('updates')
      .select('*')
      .eq('complaint_id', complaintId)
      .order('created_at', { ascending: false });

    res.json({ ...complaint, updates: updates || [] });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update complaint status (admin only)
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status, message } = req.body;
    const complaintId = req.params.id;
    const adminId = req.user.id;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    // Update complaint status
    const { error: updateError } = await db
      .from('complaints')
      .update({ status, updated_at: new Date() })
      .eq('id', complaintId);

    if (updateError) {
      return res.status(500).json({ error: 'Failed to update complaint' });
    }

    // Add update record if message is provided
    if (message) {
      await db
        .from('updates')
        .insert([{ complaint_id: complaintId, admin_id: adminId, message, status }]);
    }

    res.json({ message: 'Complaint updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get analytics (admin only)
router.get('/admin/analytics', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { data: complaints, error } = await db
      .from('complaints')
      .select('status');

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch analytics' });
    }

    const total_complaints = complaints.length;
    const pending = complaints.filter(c => c.status === 'Pending').length;
    const in_progress = complaints.filter(c => c.status === 'In Progress').length;
    const resolved = complaints.filter(c => c.status === 'Resolved').length;

    res.json({ total_complaints, pending, in_progress, resolved });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
