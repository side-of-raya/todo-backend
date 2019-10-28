'use strict';

module.exports = {
  up: async (Sequelize, DataTypes) => {
    await Sequelize.removeColumn('todos', 'queue_number');
    await Sequelize.addColumn('todos', 'queue_number', {
      
        type: DataTypes.INTEGER,
        autoIncrement: true,
        
      });
  },
  down: async (Sequelize, DataTypes) => {
    await Sequelize.removeColumn('todos', 'queue_number');
    await Sequelize.addColumn('todos', 'queue_number', {
        type: DataTypes.STRING,
      });
  },
};

