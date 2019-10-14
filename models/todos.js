const db = require('../db/db');
const { Sequelize, DataTypes } = require('../node_modules/sequelize');

const todos = db.define('todos', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
  },
  value: {
    type: Sequelize.DataTypes.STRING,
  },
  is_checked: {
    type: Sequelize.DataTypes.BOOLEAN,
    default: false,
  },
});

module.exports = todos;
