const { wordCount } = require('../utils/wordCount');

const MAX_BODY_WORDS = 60;
const MAX_TITLE_LENGTH = 500;

function validateCreatePost(req, res, next) {
  const { title, body } = req.body;
  const errs = [];
  if (!title || typeof title !== 'string') {
    errs.push('title is required and must be a string');
  } else if (title.length > MAX_TITLE_LENGTH) {
    errs.push(`title must be at most ${MAX_TITLE_LENGTH} characters`);
  }
  if (!body || typeof body !== 'string') {
    errs.push('body is required and must be a string');
  } else {
    const count = wordCount(body);
    if (count > MAX_BODY_WORDS) {
      errs.push(`body must be at most ${MAX_BODY_WORDS} words (got ${count})`);
    }
  }
  if (errs.length) {
    return res.status(400).json({ success: false, message: errs.join('; ') });
  }
  next();
}

function validateUpdatePost(req, res, next) {
  const { title, body } = req.body;
  if (title !== undefined) {
    if (typeof title !== 'string') {
      return res.status(400).json({ success: false, message: 'title must be a string' });
    }
    if (title.length > MAX_TITLE_LENGTH) {
      return res.status(400).json({ success: false, message: `title must be at most ${MAX_TITLE_LENGTH} characters` });
    }
  }
  if (body !== undefined) {
    if (typeof body !== 'string') {
      return res.status(400).json({ success: false, message: 'body must be a string' });
    }
    const count = wordCount(body);
    if (count > MAX_BODY_WORDS) {
      return res.status(400).json({ success: false, message: `body must be at most ${MAX_BODY_WORDS} words (got ${count})` });
    }
  }
  next();
}

function validateReact(req, res, next) {
  const { reaction } = req.body;
  const valid = ['thumbs_up', 'thumbs_down', 'heart'];
  if (!reaction || !valid.includes(reaction)) {
    return res.status(400).json({
      success: false,
      message: `reaction must be one of: ${valid.join(', ')}`,
    });
  }
  next();
}

module.exports = {
  validateCreatePost,
  validateUpdatePost,
  validateReact,
};
