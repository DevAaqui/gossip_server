require('dotenv').config();
const { Sequelize } = require('sequelize');

console.log(process.env.MYSQL_PUBLIC_URL);

console.log(process.env.MYSQLDATABASE);
console.log(process.env.MYSQLUSER);
console.log(process.env.MYSQLPASSWORD);
console.log(process.env.MYSQLHOST);
console.log(process.env.MYSQLPORT);

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
