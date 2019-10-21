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
});

users.signUp = async function(req, res) {
  try {
    const user = await users.findOne({
      where: {
        email: req.body.email
      }
    })
    if (user) return res.sendStatus(403)
    users.create({
      name: req.body.name,
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, 8),
    }).then(
      res.sendStatus(200)
    )
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

users.generateAuthToken = function(user) {
  const token = jwt.sign({ id: user.id }, process.env.KEY);
  return token;
};

users.findByCredentials = async (email, password) => {
  try {
    const user = await users.findOne({ where: { email } });
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!user || !isPasswordMatch) {
      res.status(403).send('wrong login or pass');
    }
    return user;
  } catch (error) {
    console.log(error);
    res.status(404).send('smth s went wrong')
  }
};

module.exports = users;
