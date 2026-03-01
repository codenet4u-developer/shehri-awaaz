import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import complaintRoutes from './routes/complaints.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Serve frontend build in production
const frontendPath = path.join(__dirname, '../frontend/dist');
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(frontendPath));
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'API is running' });
});

// Serve React app for all non-API routes (SPA)
app.get('*', (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    res.sendFile(path.join(frontendPath, 'index.html'));
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
});
