require('dotenv').config('../.env');
const { Sequelize } = require('sequelize');

const db = new Sequelize(
  process.env.DBNAME,
  process.env.DBUSER,
  process.env.DBPASS,
  {
    host: 'localhost',
    dialect: 'postgres',
    define: {
      timestamps: false,
    },
  },
);

module.exports = db;
