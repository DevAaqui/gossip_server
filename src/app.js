const path = require('path');
const express = require('express');
const cors = require('cors');
const adminRoutes = require('./routes/adminRoutes');
const postRoutes = require('./routes/postRoutes');
const { UPLOAD_DIR } = require('./middleware/upload');

const app = express();

// Allow frontend origins (localhost for dev, add production URL when you deploy frontend)
const allowedOrigins = [
  'http://localhost:8081',
  'http://localhost:3000',
  'http://127.0.0.1:8081',
  'http://127.0.0.1:3000',
];
if (process.env.FRONTEND_ORIGIN) {
  allowedOrigins.push(process.env.FRONTEND_ORIGIN);
}

app.use(cors({
  origin: (origin, cb) => {
    // Allow requests with no origin (e.g. Postman, server-to-server)
    if (!origin) return cb(null, true);
    if (allowedOrigins.includes(origin)) return cb(null, true);
    cb(null, true); // allow other origins for now; set to cb(new Error('Not allowed')) to restrict
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.resolve(UPLOAD_DIR)));

app.use('/api/admin', adminRoutes);
app.use('/api/posts', postRoutes);

app.get('/health', (req, res) => {
  res.json({ ok: true, service: 'gossip_server' });
});

app.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ success: false, message: 'File too large' });
  }
  if (err.message && err.message.includes('Only images')) {
    return res.status(400).json({ success: false, message: err.message });
  }
  console.error(err);
  res.status(500).json({ success: false, message: 'Server error' });
});

module.exports = app;
