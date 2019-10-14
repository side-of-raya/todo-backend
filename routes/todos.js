const express = require('express');
const todos = require('../models/todos');
const auth = require('../middleware/auth');
const users = require('../models/users');

const router = express.Router();

router.get('/todos', auth, async (req, res) => {
  try {
    const token = req.headers.authorization;
    const user = await users.findID(token);
    todos.findAll({
      where: {
        user_id: user.id,
      },
    }).then((items) => {
      res.send(items);
    });
  } catch (error) {
    res.sendStatus(401);
    console.log(error);
  }
});

router.post('/todos', auth, async (req, res) => {
  try {
    const token = req.headers.authorization;
    const user = await users.findID(token);
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
      const updated = item.is_checked ? false : true;
      item.update({
        is_checked: updated,
      });
      res.sendStatus(200);
    });
});

router.delete('/todo/:id', auth, async (req, res) => {
  const token = req.headers.authorization;
  const user = await users.findID(token);
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
  const user = await users.findID(token);
  todos.destroy({
    where: {
      user_id: user.id,
      is_checked: true,
    },
  })
    .then(res.sendStatus(200));
});

module.exports = router;
