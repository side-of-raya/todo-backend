const router = require('express').Router();

router.post('/users', async (req, res) => {
  try {
    const models = res.app.get('models');
    models.users.signUp(req, res)
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
});

router.post('/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const models = res.app.get('models');
    const user = await models.users.findByCredentials(email, password);
    console.log(user)
    if (!user) {
      return res.sendStatus(403);
    }
    const token = await models.users.generateAuthToken(user);
    models.users.findOne({ where: { email } })
    res.status(200).send({ authorization: token });
  } catch (error) {
    res.status(400);
  }
});

module.exports = router;
