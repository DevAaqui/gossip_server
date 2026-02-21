const bcrypt = require('bcryptjs');
const { Admin, Post } = require('../models');
const { signToken } = require('../middleware/auth');
const { getMediaUrl } = require('../middleware/upload');
const { formatPost } = require('../utils/formatPost');

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required' });
    }
    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    const match = await bcrypt.compare(password, admin.password_hash);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    const token = signToken(admin.id);
    return res.json({
      success: true,
      token,
      admin: { id: admin.id, email: admin.email, name: admin.name },
    });
  } catch (err) {
    console.error('Admin login error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}

function inferMediaTypeFromUrl(url) {
  if (!url) return 'image';
  const u = url.toLowerCase();
  if (u.includes('.mp4') || u.includes('.webm') || u.includes('video')) return 'video';
  return 'image';
}

async function createPost(req, res) {
  try {
    const admin_id = req.adminId;
    const { title, body, imageUri, media_url: bodyMediaUrl, media_type: bodyMediaType } = req.body;
    let media_url = null;
    let media_type = 'image';
    if (req.file) {
      media_url = getMediaUrl(req.file.filename);
      const videoMimes = ['video/mp4', 'video/webm'];
      media_type = videoMimes.includes(req.file.mimetype) ? 'video' : 'image';
    } else if (imageUri || bodyMediaUrl) {
      media_url = (imageUri || bodyMediaUrl).trim();
      media_type = bodyMediaType === 'video' ? 'video' : inferMediaTypeFromUrl(media_url);
    }
    const post = await Post.create({
      admin_id,
      title,
      body,
      media_url: media_url || null,
      media_type: media_type || 'image',
    });
    return res.status(201).json({ success: true, post: formatPost(post) });
  } catch (err) {
    console.error('Create post error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}

async function updatePost(req, res) {
  try {
    const admin_id = req.adminId;
    const postId = parseInt(req.params.id, 10);
    if (isNaN(postId)) {
      return res.status(400).json({ success: false, message: 'Invalid post id' });
    }
    const existing = await Post.findByPk(postId);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    if (existing.admin_id !== admin_id) {
      return res.status(403).json({ success: false, message: 'Not allowed to edit this post' });
    }
    const { title, body, imageUri, media_url: bodyMediaUrl, media_type: bodyMediaType } = req.body;
    let media_url = existing.media_url;
    let media_type = existing.media_type;
    if (req.file) {
      media_url = getMediaUrl(req.file.filename);
      const videoMimes = ['video/mp4', 'video/webm'];
      media_type = videoMimes.includes(req.file.mimetype) ? 'video' : 'image';
    } else if (imageUri !== undefined || bodyMediaUrl !== undefined) {
      const url = (imageUri || bodyMediaUrl || '').trim();
      media_url = url || null;
      media_type = bodyMediaType === 'video' ? 'video' : inferMediaTypeFromUrl(media_url || '');
    }
    existing.title = title !== undefined ? title : existing.title;
    existing.body = body !== undefined ? body : existing.body;
    existing.media_url = media_url;
    existing.media_type = media_type;
    await existing.save();
    return res.json({ success: true, post: formatPost(existing) });
  } catch (err) {
    console.error('Update post error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}

async function deletePost(req, res) {
  try {
    const admin_id = req.adminId;
    const postId = parseInt(req.params.id, 10);
    if (isNaN(postId)) {
      return res.status(400).json({ success: false, message: 'Invalid post id' });
    }
    const existing = await Post.findByPk(postId);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    if (existing.admin_id !== admin_id) {
      return res.status(403).json({ success: false, message: 'Not allowed to delete this post' });
    }
    await Post.destroy({ where: { id: postId, admin_id } });
    return res.json({ success: true, message: 'Post deleted' });
  } catch (err) {
    console.error('Delete post error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}

async function listMyPosts(req, res) {
  try {
    const admin_id = req.adminId;
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const offset = (page - 1) * limit;
    const posts = await Post.findAll({
      where: { admin_id },
      order: [['created_at', 'DESC']],
      limit,
      offset,
    });
    return res.json({ success: true, posts: posts.map(formatPost) });
  } catch (err) {
    console.error('List admin posts error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}

module.exports = {
  login,
  createPost,
  updatePost,
  deletePost,
  listMyPosts,
};
