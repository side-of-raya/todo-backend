const express = require('express');
const bcrypt = require('bcryptjs');
const users = require('../models/users');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/users', async (req, res) => {
  try {
    users.signUp(req, res)
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
});

router.post('/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await users.findByCredentials(email, password);
    console.log(user)
    if (!user) {
      return res.sendStatus(403);
    }
    const token = await users.generateAuthToken(user);
    users.findOne({ where: { email } })
    res.send({ authorization: token });
  } catch (error) {
    res.status(400);
  }
});

module.exports = router;
