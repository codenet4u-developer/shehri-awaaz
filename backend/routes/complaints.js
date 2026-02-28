import express from 'express';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import db from '../db/database.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Create a complaint
router.post('/', authMiddleware, upload.single('image'), (req, res) => {
  try {
    const { title, description, category, location } = req.body;
    const userId = req.user.id;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    if (!title || !description || !category || !location) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    db.run(
      'INSERT INTO complaints (user_id, title, description, category, location, image_path) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, title, description, category, location, imagePath],
      function (err) {
        if (err) {
          return res.status(500).json({ error: 'Failed to create complaint' });
        }
        res.status(201).json({ id: this.lastID, message: 'Complaint created successfully' });
      }
    );
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all complaints (admin) or user's complaints (citizen)
router.get('/', authMiddleware, (req, res) => {
  try {
    let query = 'SELECT c.*, u.name, u.email FROM complaints c JOIN users u ON c.user_id = u.id';
    let params = [];

    if (req.user.role === 'citizen') {
      query += ' WHERE c.user_id = ?';
      params.push(req.user.id);
    }

    query += ' ORDER BY c.created_at DESC';

    db.all(query, params, (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch complaints' });
      }
      res.json(rows);
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get a single complaint
router.get('/:id', authMiddleware, (req, res) => {
  try {
    const complaintId = req.params.id;

    db.get('SELECT * FROM complaints WHERE id = ?', [complaintId], (err, complaint) => {
      if (err || !complaint) {
        return res.status(404).json({ error: 'Complaint not found' });
      }

      // Check authorization
      if (req.user.role === 'citizen' && complaint.user_id !== req.user.id) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      // Fetch updates
      db.all('SELECT * FROM updates WHERE complaint_id = ? ORDER BY created_at DESC', [complaintId], (err, updates) => {
        res.json({ ...complaint, updates: updates || [] });
      });
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update complaint status (admin only)
router.put('/:id', authMiddleware, adminMiddleware, (req, res) => {
  try {
    const { status, message } = req.body;
    const complaintId = req.params.id;
    const adminId = req.user.id;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    // Update complaint status
    db.run('UPDATE complaints SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [status, complaintId], function (err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to update complaint' });
      }

      // Add update record if message is provided
      if (message) {
        db.run('INSERT INTO updates (complaint_id, admin_id, message, status) VALUES (?, ?, ?, ?)', [complaintId, adminId, message, status]);
      }

      res.json({ message: 'Complaint updated successfully' });
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get analytics (admin only)
router.get('/admin/analytics', authMiddleware, adminMiddleware, (req, res) => {
  try {
    db.get(
      `SELECT 
        COUNT(*) as total_complaints,
        SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'In Progress' THEN 1 ELSE 0 END) as in_progress,
        SUM(CASE WHEN status = 'Resolved' THEN 1 ELSE 0 END) as resolved
       FROM complaints`,
      (err, row) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to fetch analytics' });
        }
        res.json(row);
      }
    );
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
