'use strict';

module.exports = {
  up: async (Sequelize, DataTypes) => {
    await Sequelize.changeColumn('todos', 'queue_number', {
      
      type: DataTypes.STRING,
      //autoIncrement: true,
      
    });
  },
  down: async (Sequelize, DataTypes) => {
    await Sequelize.changeColumn('todos', 'queue_number', {
      
      type: DataTypes.INTEGER,
      autoIncrement: true,
      
    });
  },
};