module.exports = (sequelize, DataTypes) => {
  const Reaction = sequelize.define(
    'Reaction',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      post_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'posts', key: 'id' },
        onDelete: 'CASCADE',
      },
      user_identifier: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      reaction_type: {
        type: DataTypes.ENUM('thumbs_up', 'thumbs_down', 'heart'),
        allowNull: false,
      },
    },
    {
      tableName: 'reactions',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false,
      indexes: [
        { fields: ['post_id'] },
        { unique: true, fields: ['post_id', 'user_identifier'] },
      ],
    }
  );

  Reaction.associate = (models) => {
    Reaction.belongsTo(models.Post, { foreignKey: 'post_id' });
  };

  return Reaction;
};
