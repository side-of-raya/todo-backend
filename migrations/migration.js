'use strict';

module.exports = {
  up: async (Sequelize, DataTypes) => {
    await Sequelize.addColumn('todos', 'queue_number', {
      
      type: DataTypes.INTEGER,
      autoIncrement: true,
      
    });
  },
};