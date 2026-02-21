const Post = require('../models/Post');
const Reaction = require('../models/Reaction');

async function list(req, res) {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const posts = await Post.findAll({ page, limit });
    return res.json({ success: true, posts });
  } catch (err) {
    console.error('List posts error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}

async function getOne(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid post id' });
    }
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    return res.json({ success: true, post });
  } catch (err) {
    console.error('Get post error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}

async function react(req, res) {
  try {
    const postId = parseInt(req.params.id, 10);
    if (isNaN(postId)) {
      return res.status(400).json({ success: false, message: 'Invalid post id' });
    }
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    const reaction_type = req.body.reaction;
    const user_identifier = req.body.user_identifier || req.headers['x-user-identifier'] || req.ip || 'anonymous';
    const previous = await Reaction.findByUserAndPost(postId, user_identifier);
    if (previous) {
      await Post.decrementReaction(postId, previous.reaction_type);
    }
    await Reaction.setReaction(postId, user_identifier, reaction_type);
    await Post.incrementReaction(postId, reaction_type);
    const updated = await Post.findById(postId);
    return res.json({ success: true, post: updated });
  } catch (err) {
    console.error('React error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}

module.exports = {
  list,
  getOne,
  react,
};
