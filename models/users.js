require('dotenv').config('../.env');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

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
    isActive: {
      type: DataTypes.BOOLEAN,
    }
  },
  {
    timestamps: false
  });

  users.signUp = async function(req, res) {
    try {
      const models = res.app.get('models')
      let user = await users.findOne({
        where: {
          email: req.body.email
        }
      })
      if (user) return res.sendStatus(403)
      user = await users.create({
        name: req.body.name,
        email: req.body.email,
        password: await bcrypt.hash(req.body.password, 8),
      })
      await models.users_tokens.create({ 
        user_id: user.id,
        value: await jwt.sign({id: user.id}, process.env.KEY),
      });
      users.confirmEmail(req.body.email, req.body.name, res)
      res.status(200).send("Welcome!");
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
      if (!user) {
        res.status(401).send('Wrong login or pass');
        return;
      }
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        res.status(401).send('Wrong login or pass');
        return;
      }
      return user;
    } catch (error) {
      console.log(error);
      res.status(404).send('smth s went wrong')
    }
  };

  users.confirmEmail = async (email, name, res) => {
    async function main() {
      const models = res.app.get('models')
      const user = await users.findOne({ where: { email } });
      const token = await models.users_tokens.findOne({ where: { user_id: user.id } });
      let transporter = nodemailer.createTransport({
          host: 'smtp.mail.ru',
          port: 587,
          secure: false, // true for 465, false for other ports
          auth: {
              user: process.env.MAIL_LOGIN,
              pass: process.env.MAIL_PASS,
          }
      });
      let info = await transporter.sendMail({
          from: `"KuKu 👻" <i.taake@mail.ru>`,
          to: `${name}, ${email}`,
          subject: 'Hello ✔',
          text: 'Welcome to todos! <br/> We dont want you to lose you, so bla bla bla click here: '
            + process.env.HOST + '/Confirm/?token=' + token.value,
          // html: '<b>Hello world?</b>'
      });
      console.log(info)
    }
    
    main();
  }
  return users;
}
