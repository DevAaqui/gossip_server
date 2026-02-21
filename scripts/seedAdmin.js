/**
 * Create an admin user. Set ADMIN_EMAIL and ADMIN_PASSWORD in .env or pass as args.
 * Usage: node scripts/seedAdmin.js [email] [password]
 */
require('dotenv').config();
const Admin = require('../src/models/Admin');

async function main() {
  const email = process.argv[2] || process.env.ADMIN_EMAIL;
  const password = process.argv[3] || process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    console.error('Usage: node scripts/seedAdmin.js <email> <password>');
    console.error('Or set ADMIN_EMAIL and ADMIN_PASSWORD in .env');
    process.exit(1);
  }
  const existing = await Admin.findByEmail(email);
  if (existing) {
    console.log('Admin already exists for', email);
    process.exit(0);
  }
  await Admin.create({ email, password, name: 'Admin' });
  console.log('Admin created for', email);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
