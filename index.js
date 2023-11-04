const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const apiRoutes = require('./apiRoute/apiRoute');

const cors = require('cors');

let app = express();
let port = 7777;

app.use(cors());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://thethiptopkhalidabouelaiz.eu:4200');
 res.setHeader('Access-Control-Request-Method', '"');
  res.setHeader('Access-Control-Allow-Headers', '"');
  next();
});
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
mongoose
  .connect('mongodb://127.0.0.1:27017/PFA', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('conneté a la BDD');
  })
  .catch((err) => {
    console.log('Erreur de connexion', err);
  });

app.use('/', apiRoutes);
app.listen(port, () => {
  console.log('Server en ligne port 7777');
});
