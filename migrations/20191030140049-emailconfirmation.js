'use strict';

module.exports = {
  up: async (Sequelize, DataTypes) => {
    await Sequelize.createTable('users_tokens', {
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
    });
  },
  down: async (Sequelize) => {
    await Sequelize.removeTable('users_tokens');
  }
};
