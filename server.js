require('dotenv').config();
const app = require('./src/app');
const { sequelize } = require('./src/models');

const PORT = parseInt(process.env.PORT, 10) || 3000;

sequelize.authenticate()
  .then(() => {
    console.log('Database connected.');
    app.listen(PORT, () => {
      console.log(`Gossip server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection failed:', err.message);
    process.exit(1);
  });
