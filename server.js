var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var logger = require('morgan');

app.set('view engine', 'pug');
app.set('views', './views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('common'));

app.get('/', (req, res) => res.render('index', {
  tekst: 'Min besked',
  arr: [1, 2, 3]
}));
app.get('/test', (req, res) => res.render('index', {
  arr: [1, 2, 3]
}))

app.get('*', (req, res) => res.send('404 Error'));

app.listen(3000);