require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.MYSQLDATABASE || 'gossip_db',
  process.env.MYSQLUSER || 'root',
  process.env.MYSQLPASSWORD || '',
  {
    host: process.env.MYSQLHOST || 'mysql.railway.internal',
    port: parseInt(process.env.MYSQLPORT, 10) || 3306,
    dialect: 'mysql',
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    logging: true //process.env.NODE_ENV === 'development' ? console.log : true,
  }
);

module.exports = sequelize;
