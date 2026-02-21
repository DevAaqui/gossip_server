const Admin = require('../models/Admin');
const Post = require('../models/Post');
const { signToken } = require('../middleware/auth');
const { getMediaUrl } = require('../middleware/upload');

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required' });
    }
    const admin = await Admin.findByEmail(email);
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    const match = await Admin.comparePassword(password, admin.password_hash);
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

async function createPost(req, res) {
  try {
    const admin_id = req.adminId;
    const { title, body } = req.body;
    let media_url = null;
    let media_type = 'image';
    if (req.file) {
      media_url = getMediaUrl(req.file.filename);
      const videoMimes = ['video/mp4', 'video/webm'];
      media_type = videoMimes.includes(req.file.mimetype) ? 'video' : 'image';
    }
    const id = await Post.create({ admin_id, title, body, media_url, media_type });
    const post = await Post.findById(id);
    return res.status(201).json({ success: true, post });
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
    const existing = await Post.findById(postId);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    if (existing.admin_id !== admin_id) {
      return res.status(403).json({ success: false, message: 'Not allowed to edit this post' });
    }
    const { title, body } = req.body;
    let media_url = existing.media_url;
    let media_type = existing.media_type;
    if (req.file) {
      media_url = getMediaUrl(req.file.filename);
      const videoMimes = ['video/mp4', 'video/webm'];
      media_type = videoMimes.includes(req.file.mimetype) ? 'video' : 'image';
    }
    const updates = { title: title !== undefined ? title : existing.title, body: body !== undefined ? body : existing.body, media_url, media_type };
    await Post.update(postId, admin_id, updates);
    const post = await Post.findById(postId);
    return res.json({ success: true, post });
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
    const existing = await Post.findById(postId);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    if (existing.admin_id !== admin_id) {
      return res.status(403).json({ success: false, message: 'Not allowed to delete this post' });
    }
    await Post.remove(postId, admin_id);
    return res.json({ success: true, message: 'Post deleted' });
  } catch (err) {
    console.error('Delete post error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}

async function listMyPosts(req, res) {
  try {
    const admin_id = req.adminId;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const posts = await Post.findByAdminId(admin_id, { page, limit });
    return res.json({ success: true, posts });
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
