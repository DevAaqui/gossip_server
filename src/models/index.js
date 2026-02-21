const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

const Admin = require('./Admin')(sequelize, DataTypes);
const Post = require('./Post')(sequelize, DataTypes);
const Reaction = require('./Reaction')(sequelize, DataTypes);

// Associations
Admin.associate({ Admin, Post, Reaction });
Post.associate({ Admin, Post, Reaction });
Reaction.associate({ Admin, Post, Reaction });

module.exports = {
  sequelize,
  Admin,
  Post,
  Reaction,
};
