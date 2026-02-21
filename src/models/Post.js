module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    'Post',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      admin_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'admins', key: 'id' },
        onDelete: 'CASCADE',
      },
      title: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      body: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      media_url: {
        type: DataTypes.STRING(1000),
        allowNull: true,
      },
      media_type: {
        type: DataTypes.ENUM('image', 'video'),
        defaultValue: 'image',
      },
      thumbs_up_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      thumbs_down_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      heart_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      tableName: 'posts',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      indexes: [{ fields: ['created_at'], order: [['created_at', 'DESC']] }],
    }
  );

  Post.associate = (models) => {
    Post.belongsTo(models.Admin, { foreignKey: 'admin_id' });
    Post.hasMany(models.Reaction, { foreignKey: 'post_id' });
  };

  return Post;
};
