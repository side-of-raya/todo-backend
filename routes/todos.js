const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();
router.get('/todos', auth, async (req, res) => {
  try {
    console.log('todos')
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
    console.log('todo post')
    const models = res.app.get('models');
    const user = res.locals.user;
    const response = await models.todos.create({
      user_id: user.id,
      value: req.body.value,
    })
    res.status(201).send(response.dataValues)    
  } catch (error) {
    console.log(error);
  }
});

router.patch('/todo', auth, async (req, res) => {
  try{
    console.log('todo patch')
    const models = res.app.get('models');
    const { id, args } = req.body;
    const item = await models.todos.findOne({
      where: id
    })
    if (args.queue_number) {
      let number;
      if (id.queue_number > args.queue_number){
        number = await moveDown(args.queue_number, id.queue_number)
      } else {
        number = await moveUp(args.queue_number, id.queue_number)
      }
      await item.update({queue_number: number});
    } else {
      const item = await models.todos.findOne({ where: req.body.id })
      await item.update(args);
    }
    res.status(201).send(item.dataValues);
  } catch (error) {
    console.log(error)
  }
});

moveUp = async(queold, freed) => {
  console.log(queold, ' = queold', ', freed = ', freed)
  const quenew = await models.todos.findOne({ where: {
    queue_number: queold
  } });
  if (quenew && queold !== freed) {
    const number = await moveUp(queold - 1, freed);
    await quenew.update({ queue_number: number });
  }
  console.log(queold, ' = queold')
  return queold;
}

moveDown = async(queold, freed) => {
  console.log(queold, ' = queold', ', freed = ', freed)
  const quenew = await models.todos.findOne({ where: {
    queue_number: queold
  } });
  if (quenew && queold !== freed ) {
    const number = await moveDown(queold + 1, freed);
    console.log(quenew.dataValues)
    await quenew.update({ queue_number: number });
    console.log(quenew.dataValues)
  }
  console.log(queold, ' = queold')
  return queold;
}

router.delete('/todo/:id', auth, async (req, res) => {
  try{
    console.log('todo del')
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
  console.log('todos del')
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
