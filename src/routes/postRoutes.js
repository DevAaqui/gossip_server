const express = require('express');
const postController = require('../controllers/postController');
const { validateReact } = require('../middleware/validate');

const router = express.Router();

router.get('/', postController.list);
router.get('/:id', postController.getOne);
router.post('/:id/react', validateReact, postController.react);

module.exports = router;
