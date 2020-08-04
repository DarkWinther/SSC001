import { GameModel } from '../models/game';
import { connect, connection } from 'mongoose';
import { connectionString } from '../config/mongo';

connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
connection.on('error', console.error.bind(console, 'connection error:'));
connection.once('open', async () => {
  console.log('Connected to mongodb');

  await Promise.all([
    new GameModel({
      title: 'Doom',
    }).save(),
    new GameModel({
      title: 'Legend of Zelda',
    }).save(),
    new GameModel({
      title: 'Heroes of Might and Magic III',
    }).save(),
    new GameModel({
      title: 'Diablo II',
      coverImg:
        'https://upload.wikimedia.org/wikipedia/en/d/d5/Diablo_II_Coverart.png',
    }).save(),
  ]);

  connection.close();
});
