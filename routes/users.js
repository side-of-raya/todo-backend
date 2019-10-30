const router = require('express').Router();
router.post('/user', async (req, res) => {
  try {
    const models = res.app.get('models');
    models.users.signUp(req, res);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
});

router.post('/user/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const models = res.app.get('models');
    const user = await models.users.findByCredentials(res, email, password);
    console.log(user.dataValues)
    if (!user) {
      return res.sendStatus(401);
    }
    const token = await models.users.generateAuthToken(user);
    res.status(200).send({ authorization: token });
  } catch (error) {
    res.status(400);
  }
});

router.get('/user/active/', async (req, res) => {
  try {
    const models = res.app.get('models');
    const token = await models.users_tokens.findOne({where: {value: req.query.token}});
    if (token) {
      const user = await models.users.findOne({where: {id: token.user_id}});
      await user.update({ isActive: true });
      await models.users_tokens.destroy({ where: {user_id: token.user_id}})
    }
    res.status(200).send('User is active!')
  } catch (error) {
    res.status(400);
  }
});

module.exports = router;
