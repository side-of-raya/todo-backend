require('dotenv').config('../.env');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = (Sequelize, DataTypes) => {
  const users = Sequelize.define('users', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.CHAR(20),
    },
    email: {
      type: DataTypes.CHAR(30),
    },
    password: {
      type: DataTypes.TEXT,
    },
  },
  {
    timestamps: false
  });

  users.signUp = async function(req, res) {
    try {
      const user = await models.users.findOne({
        where: {
          email: req.body.email
        }
      })
      if (user) return res.sendStatus(403)
      await users.create({
        name: req.body.name,
        email: req.body.email,
        password: await bcrypt.hash(req.body.password, 8),
      })
      res.status(200).send;
    } catch (error) {
      console.log(error);
      res.sendStatus(400);
    }
  };

  users.generateAuthToken = function(user) {
    const token = jwt.sign({ id: user.id }, process.env.KEY);
    return token;
  };

  users.findByCredentials = async (res, email, password) => {
    try {
      const models = res.app.get('models')
      const user = await models.users.findOne({ where: { email } });
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!user || !isPasswordMatch) {
        res.status(401).send('Wrong login or pass');
      }
      return user;
    } catch (error) {
      console.log(error);
      res.status(404).send('smth s went wrong')
    }
  };
  return users;
}
