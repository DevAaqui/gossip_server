const db = require('../config/db');

async function create({ admin_id, title, body, media_url, media_type }) {
  const [result] = await db.execute(
    `INSERT INTO posts (admin_id, title, body, media_url, media_type)
     VALUES (?, ?, ?, ?, ?)`,
    [admin_id, title, body, media_url || null, media_type || 'image']
  );
  return result.insertId;
}

async function findAll({ page = 1, limit = 10 } = {}) {
  const offset = (Math.max(1, page) - 1) * Math.min(100, Math.max(1, limit));
  const limitVal = Math.min(100, Math.max(1, limit));
  const [rows] = await db.execute(
    `SELECT id, admin_id, title, body, media_url, media_type,
            thumbs_up_count, thumbs_down_count, heart_count, created_at, updated_at
     FROM posts ORDER BY created_at DESC LIMIT ? OFFSET ?`,
    [limitVal, offset]
  );
  return rows;
}

async function findById(id) {
  const [rows] = await db.execute(
    `SELECT id, admin_id, title, body, media_url, media_type,
            thumbs_up_count, thumbs_down_count, heart_count, created_at, updated_at
     FROM posts WHERE id = ?`,
    [id]
  );
  return rows[0] || null;
}

async function findByAdminId(admin_id, { page = 1, limit = 20 } = {}) {
  const offset = (Math.max(1, page) - 1) * Math.min(100, Math.max(1, limit));
  const limitVal = Math.min(100, Math.max(1, limit));
  const [rows] = await db.execute(
    `SELECT id, admin_id, title, body, media_url, media_type,
            thumbs_up_count, thumbs_down_count, heart_count, created_at, updated_at
     FROM posts WHERE admin_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?`,
    [admin_id, limitVal, offset]
  );
  return rows;
}

async function update(id, admin_id, { title, body, media_url, media_type }) {
  const updates = [];
  const values = [];
  if (title !== undefined) {
    updates.push('title = ?');
    values.push(title);
  }
  if (body !== undefined) {
    updates.push('body = ?');
    values.push(body);
  }
  if (media_url !== undefined) {
    updates.push('media_url = ?');
    values.push(media_url);
  }
  if (media_type !== undefined) {
    updates.push('media_type = ?');
    values.push(media_type);
  }
  if (updates.length === 0) return false;
  values.push(id, admin_id);
  const [result] = await db.execute(
    `UPDATE posts SET ${updates.join(', ')} WHERE id = ? AND admin_id = ?`,
    values
  );
  return result.affectedRows > 0;
}

async function remove(id, admin_id) {
  const [result] = await db.execute('DELETE FROM posts WHERE id = ? AND admin_id = ?', [id, admin_id]);
  return result.affectedRows > 0;
}

async function incrementReaction(post_id, reaction_type) {
  const col = reaction_type === 'thumbs_up' ? 'thumbs_up_count'
    : reaction_type === 'thumbs_down' ? 'thumbs_down_count'
    : 'heart_count';
  await db.execute(`UPDATE posts SET ${col} = ${col} + 1 WHERE id = ?`, [post_id]);
}

async function decrementReaction(post_id, reaction_type) {
  const col = reaction_type === 'thumbs_up' ? 'thumbs_up_count'
    : reaction_type === 'thumbs_down' ? 'thumbs_down_count'
    : 'heart_count';
  await db.execute(`UPDATE posts SET ${col} = GREATEST(0, ${col} - 1) WHERE id = ?`, [post_id]);
}

module.exports = {
  create,
  findAll,
  findById,
  findByAdminId,
  update,
  remove,
  incrementReaction,
  decrementReaction,
};
