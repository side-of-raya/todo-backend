const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();
router.get('/todos', auth, async (req, res) => {
  try {
    const models = res.app.get('models');
    const user = res.locals.user;
    const items = await models.todos.findAll({
      where: {
        user_id: user.id,
      },
      order: ['queue_number']
    })
    res.status(201).send(items);
  } catch (error) {
    console.log(error);
    res.status(404).send(error);
  }
});

router.post('/todo', auth, async (req, res) => {
  try {
    const models = res.app.get('models');
    const user = res.locals.user;
    const max = await models.todos.max('queue_number');
    const response = await models.todos.create({
      user_id: user.id,
      value: req.body.value,
      queue_number: max + 10000 || 0,
    })
    res.status(201).send(response.dataValues)    
  } catch (error) {
    console.log(error);
  }
});

router.patch('/todo', auth, async (req, res) => {
  try {
    const models = res.app.get('models');
    const { id, args } = req.body;
    const item = await models.todos.findOne({where: id})
    await item.update(args);
    res.status(201).send(item.dataValues);
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
