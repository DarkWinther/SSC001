import express from 'express';
import logger from 'morgan';
import initRoutes from './routes.mjs';

const app = express();

app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger('dev'));

initRoutes(app);

app.listen(3000);