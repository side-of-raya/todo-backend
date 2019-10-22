require('dotenv').config('../.env');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');
const app = express();

app.use(cors({ origin: '*' }));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

models = require('./db').models;

app.set('models', db.models);
app.set('db', db.db);

app.use('/', require('./routes/todos'));
app.use('/', require('./routes/users'));

app.listen(process.env.PORT);
