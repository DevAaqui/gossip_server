const db = require('../config/db');
const bcrypt = require('bcryptjs');

async function findByEmail(email) {
  const [rows] = await db.execute('SELECT * FROM admins WHERE email = ?', [email]);
  return rows[0] || null;
}

async function findById(id) {
  const [rows] = await db.execute('SELECT id, email, name, created_at FROM admins WHERE id = ?', [id]);
  return rows[0] || null;
}

async function create({ email, password, name }) {
  const password_hash = await bcrypt.hash(password, 10);
  const [result] = await db.execute(
    'INSERT INTO admins (email, password_hash, name) VALUES (?, ?, ?)',
    [email, password_hash, name || null]
  );
  return result.insertId;
}

function comparePassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}

module.exports = {
  findByEmail,
  findById,
  create,
  comparePassword,
};
