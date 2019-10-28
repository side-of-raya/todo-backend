require('dotenv').config('../.env');
const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  try {
    const models = res.app.get('models');
    const token = req.headers.authorization;
    if (!token) {
      res.status(403).send("Invalid token");
      return;
    }
    const data = jwt.verify(token, process.env.KEY);
    const user = await models.users.findOne({ id: data.id });
    if (!user) {
      res.sendStatus(401);
      return;
    }
    res.locals.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).send("oops, smth s went wrong");
  }
};

module.exports = auth;
