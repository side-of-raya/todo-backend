const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();
let count = 0;
router.get('/todos', auth, async (req, res) => {
  try {
    count++;
    console.log(count);
    const models = res.app.get('models');
    const user = res.locals.user;
    const items = await models.todos.findAll({
      where: {
        user_id: user.id,
      },
      order: ['id']
    })
    res.status(201).send(items);
  } catch (error) {
    console.log(error);
    res.sendStatus(404);
  }
});

router.post('/todo', auth, async (req, res) => {
  try {
    const models = res.app.get('models');
    const user = res.locals.user;
    const response = await models.todos.create({
      user_id: user.id,
      value: req.body.value,
    })
    console.log(response);
    res.status(201).send(response.dataValues)    
  } catch (error) {
    console.log(error);
  }
});

router.patch('/todo', auth, async (req, res) => {
  try{
    const models = res.app.get('models');
    const item = await models.todos.findOne({ where: { id: req.body.id } })
    const { args } = req.body;
    console.log(args)
    await item.update(args);
    res.status(201).send(item);
  } catch (error) {
    console.log(error)
  }
});

router.delete('/todo/:id', auth, async (req, res) => {
  try{
    const models = res.app.get('models');
    const user = res.locals.user;
    await models.todos.destroy({
      where: {
        user_id: user.id,
        id: req.params.id,
      },
    })
    res.status(204).send('Deleted successfully')
  } catch (error) {
    console.log(error)
  }
});

router.delete('/todos', auth, async (req, res) => {
  const models = res.app.get('models');
  const user = res.locals.user;
  await models.todos.destroy({
    where: {
      user_id: user.id,
      is_checked: true,
    },
  })
  res.status(204).send('Deleted successfully');
});

module.exports = router;
