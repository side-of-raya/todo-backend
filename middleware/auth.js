require('dotenv').config('../.env');
const jwt = require('jsonwebtoken');
const users = require('../models/users');

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const data = jwt.verify(token, process.env.KEY);
    const user = await users.findOne({ id: data.id, token });
    if (!user) {
      res.sendStatus(401);
      return;
    }
    next();
  } catch (error) {
    console.log(error);
  }
};

module.exports = auth;
