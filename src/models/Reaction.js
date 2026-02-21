const db = require('../config/db');

const VALID_TYPES = ['thumbs_up', 'thumbs_down', 'heart'];

async function findByUserAndPost(post_id, user_identifier) {
  const [rows] = await db.execute(
    'SELECT * FROM reactions WHERE post_id = ? AND user_identifier = ?',
    [post_id, user_identifier]
  );
  return rows[0] || null;
}

async function setReaction(post_id, user_identifier, reaction_type) {
  if (!VALID_TYPES.includes(reaction_type)) return null;
  const existing = await findByUserAndPost(post_id, user_identifier);
  if (existing) {
    if (existing.reaction_type === reaction_type) return existing.reaction_type;
    await db.execute(
      'UPDATE reactions SET reaction_type = ? WHERE post_id = ? AND user_identifier = ?',
      [reaction_type, post_id, user_identifier]
    );
    return reaction_type;
  }
  await db.execute(
    'INSERT INTO reactions (post_id, user_identifier, reaction_type) VALUES (?, ?, ?)',
    [post_id, user_identifier, reaction_type]
  );
  return reaction_type;
}

module.exports = {
  VALID_TYPES,
  findByUserAndPost,
  setReaction,
};
