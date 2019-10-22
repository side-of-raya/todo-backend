require('dotenv').config('../.env');
const { Sequelize } = require('sequelize');
const klawSync = require('klaw-sync');
const dbConfig = require('./config/default');
const path = require('path');

const db = new Sequelize(dbConfig.pg.uri,
  {
    dialect: 'postgres',
    define: {
      timestamps: false,
    },
    port: 5432,
    pool: {
      max: 10,
      min: 0,
      idle: 300000,
      acquire: 300000,
    }
  },  
);

const models = {};

const modelsPaths = klawSync(`${__dirname}/models`, {nodir: true});
try {
modelsPaths.forEach((file) => {
    if (!require(path.resolve(__dirname, file.path))) return;
    let model = db.import(path.resolve(__dirname, file.path));
    models[model.name] = model;
});
} catch (e){console.log(e)}
Object.keys(models).forEach((name) => {
    if ('associate' in models[name]) {
        models[name].associate(models);
    }
});

module.exports = { db, models } ;
