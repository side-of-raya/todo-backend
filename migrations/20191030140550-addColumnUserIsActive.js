'use strict';

module.exports = {
  up: async (Sequelize, DataTypes) => {
    await Sequelize.addColumn('users', 'isActive', {
      type: DataTypes.BOOLEAN,
      default: false,      
    });
  },
  down: async (Sequelize, DataTypes) => {
    await Sequelize.removeColumn('users', 'isActive');
  }  
}