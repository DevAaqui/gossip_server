const path = require('path');
const fs = require('fs');
const multer = require('multer');

const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB for video

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = (file.mimetype === 'video/mp4') ? '.mp4' : path.extname(file.originalname) || '.jpg';
    const name = `post_${Date.now()}_${Math.random().toString(36).slice(2, 10)}${ext}`;
    cb(null, name);
  },
});

const imageVideoFilter = (req, file, cb) => {
  const allowed = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'video/mp4',
    'video/webm',
  ];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only images (JPEG, PNG, GIF, WebP) and videos (MP4, WebM) are allowed'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: imageVideoFilter,
});

const uploadSingleMedia = upload.single('media');

function getMediaUrl(filename) {
  if (!filename) return null;
  return `/uploads/${filename}`;
}

module.exports = {
  uploadSingleMedia,
  getMediaUrl,
  UPLOAD_DIR,
};
