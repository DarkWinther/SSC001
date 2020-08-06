import express from 'express';
import logger from 'morgan';
import initRoutes from './routes';
import fileUpload from 'express-fileupload';

const app = express();
const port = 3000;

// Pug
app.set('view engine', 'pug');
app.set('views', './src/views');

// Express-Fileupload
app.use(fileUpload());

// Express
app.use(express.static('./src/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger('dev'));

initRoutes(app);

app.listen(port, error => {
  if (error) console.error(error);
  console.log(`Listening on port ${port}`);
});
