import express from 'express';
import logger from 'morgan';
import initRoutes from './routes';
import { connect, connection } from 'mongoose';
import { connectionString } from './src/config/mongo';

const app = express();
const port = 3000;

// Pug
app.set('view engine', 'pug');
app.set('views', './src/views');

// Mongoose
connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
connection.on('error', console.error.bind(console, 'connection error:'));
connection.once('open', () => {
  console.log('Connected to mongodb');
});

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
