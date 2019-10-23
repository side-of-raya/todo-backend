'use strict';

module.exports = {
  up: async (Sequelize, DataTypes) => {
    await Sequelize.createTable('users', {
      id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
          onDelete: "CASCADE",
        },
        name: {
          type: DataTypes.CHAR(20),
        },
        email: {
          type: DataTypes.CHAR(30),
        },
        password: {
          type: DataTypes.TEXT,
        },
    });
    await Sequelize.createTable('todos', {
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
        is_checked: {
          type: DataTypes.BOOLEAN,
          default: false,
        },
    });
  },
};
