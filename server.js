var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var logger = require('morgan');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('common'));

app.get('/', (req, res) => res.send('Hello world'));
app.get('*', (req, res) => res.send('404 Error'));

app.listen(3000);