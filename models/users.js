require('dotenv').config('../.env');
const bcrypt = require('bcryptjs');
const { Sequelize, DataTypes } = require('sequelize');
const jwt = require('jsonwebtoken');
const db = require('../db/db');

const users = db.define('users', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: Sequelize.DataTypes.CHAR(20),
  },
  email: {
    type: Sequelize.DataTypes.CHAR(30),
  },
  password: {
    type: DataTypes.TEXT,
  },
  token: {
    type: DataTypes.STRING,
  },
});

users.signUp = async function(req, res) {
  try {
    users.create({
      name: req.body.name,
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, 8),
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(409);
  }
};

users.generateAuthToken = async function(user) {
  const token = jwt.sign({ id: user.id }, process.env.KEY);
  await users.findOne({ where: { id: user.id } })
    .then( item => {
      item.update({
        token,
      });
    });
  return token;
};

users.findID = async function(token) {
  try {
    return await users.findOne({
      where: {
        token,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

users.findByCredentials = async (email, password) => {
  try {
    const user = await users.findOne({ where: { email } });
    if (!user) {
      throw new Error({ error: 'Invalid login credentials' });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new Error({ error: 'Invalid login credentials' });        
    }
    return user;
  } catch (error) {
    console.log(error);
  }
};

module.exports = users;
