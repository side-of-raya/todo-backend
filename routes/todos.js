const express = require('express');
const todos = require('../models/todos');
const auth = require('../middleware/auth');
const users = require('../models/users');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.get('/todos', auth, async (req, res) => {
  try {
    const token = req.headers.authorization;
    const data = jwt.verify(token, process.env.KEY);
    todos.findAll({
      where: {
        user_id: data.id,
      },
      order: ['id']
    }).then((items) => {
      res.send(items);
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(404);
  }
});

router.post('/todos', auth, async (req, res) => {
  try {
    const token = req.headers.authorization;
    const data = jwt.verify(token, process.env.KEY);
    const user = await users.findOne({ id: data.id });;
    todos.create({
      user_id: user.id,
      value: req.body.value,
    });
    res.sendStatus(200);
  } catch (error) { console.log(error); }
});

router.patch('/todos', auth, (req, res) => {
  todos.findOne({ where: { id: req.body.id } })
    .then((item) => {
      const { args } = req.body;
      item.update(args.value);
      res.sendStatus(200);
    });
});

router.delete('/todo/:id', auth, async (req, res) => {
  const token = req.headers.authorization;
  const data = jwt.verify(token, process.env.KEY);
  const user = await users.findOne({ id: data.id });
  todos.destroy({
    where: {
      user_id: user.id,
      id: req.params.id,
    },
  })
    .then(res.sendStatus(200));
});

router.delete('/todos', auth, async (req, res) => {
  const token = req.headers.authorization;
  const data = jwt.verify(token, process.env.KEY);
  const user = await users.findOne({ id: data.id });
  todos.destroy({
    where: {
      user_id: user.id,
      is_checked: true,
    },
  })
    .then(res.sendStatus(200));
});

module.exports = router;
