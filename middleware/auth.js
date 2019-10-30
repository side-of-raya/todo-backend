require('dotenv').config('../.env');
const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  try {
    const models = res.app.get('models');
    const token = req.headers.authorization;
    const data = jwt.verify(token, process.env.KEY);
    const user = await models.users.findOne({ where: {id: data.id }});
    console.log(user.id)
    if (!user || !user.isActive) {
      console.log(user, user.isActive)
      res.sendStatus(401);
      return;
    }
    res.locals.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).send("Invalid token");
  }
};

module.exports = auth;
