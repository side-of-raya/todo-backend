const express = require('express');
const bcrypt = require('bcryptjs');
const users = require('../models/users');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/users', async (req, res) => {
  try {
    users.create({
      name: req.body.name,
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, 8),
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
});

router.post('/users/login', async (req, res) => {
  try {
    const { email } = req.body;
    const { password } = req.body;
    const user = await users.findByCredentials(email, password);
    if (!user) {
      return res.sendStatus(401);
    }
    const token = await users.generateAuthToken(user);
    users.findOne({ where: { email } })
      .then((item) => {
        item.update({
          token,
        });
      });
    res.send({ authorization: token });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post('/users/logout', auth, async (req, res) => {
  try {
    const { token } = req.headers;
    await users.findOne({ where: { token } })
      .then((item) => {
        item.update({
          token: '',
        });
      });
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
