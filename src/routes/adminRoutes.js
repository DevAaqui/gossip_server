const express = require('express');
const adminController = require('../controllers/adminController');
const { requireAdmin } = require('../middleware/auth');
const { validateCreatePost, validateUpdatePost } = require('../middleware/validate');
const { uploadSingleMedia } = require('../middleware/upload');

const router = express.Router();

router.post('/login', adminController.login);

router.use(requireAdmin);

router.get('/posts', adminController.listMyPosts);
router.post('/posts', validateCreatePost, uploadSingleMedia, adminController.createPost);
router.put('/posts/:id', validateUpdatePost, uploadSingleMedia, adminController.updatePost);
router.delete('/posts/:id', adminController.deletePost);

module.exports = router;
