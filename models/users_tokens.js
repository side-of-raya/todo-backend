module.exports = (Sequelize, DataTypes) => {
    const users_tokens = Sequelize.define('users_tokens', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      value: {    
        type: DataTypes.STRING,
      },
    },
    {
      timestamps: false
    });
    return users_tokens;
  }