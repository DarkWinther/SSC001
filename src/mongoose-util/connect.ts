import { connectionString } from '../config/mongo';
import { connect, connection } from 'mongoose';

export const dbConnect = async (): Promise<void> => {
  await connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  connection.on('error', console.error.bind(console, 'connection error:'));
  connection.once('open', () => {
    console.log('Connected to mongoDb');
  });
};

export const dbDisconnect = async (): Promise<void> => {
  await connection.close();
  console.log('Disconnected from mongoDb');
};
