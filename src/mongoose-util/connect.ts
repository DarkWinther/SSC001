import { connectionString } from '../config/mongo';
import { connect, connection } from 'mongoose';

export const dbConnect = async (): Promise<void> => {
  await connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  connection.on('error', console.error.bind(console, 'connection error:'));
  console.log('Connected to mongodb');
};

export const dbDisconnect = async (): Promise<void> => {
  await connection.close();
  console.log('Disconnected from mongoDb');
};
