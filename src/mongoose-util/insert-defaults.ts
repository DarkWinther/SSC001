import { GameModel, IGame } from '../models/game';
import { create } from './game-crud';
import https from 'https';
import fs from 'fs';

const games: IGame[] = [
  new GameModel({
    title: 'Doom',
    publisher: 'id Software',
    releaseDate: new Date(1993, 11, 10),
    genre: 'FPS',
    goty: true,
    coverImg: 'Doom_cover_art.jpg',
  }),
  new GameModel({
    title: 'Legend of Zelda',
    publisher: 'Nintendo',
    releaseDate: new Date(1986, 1, 21),
    genre: 'Adventure',
  }),
  new GameModel({
    title: 'Heroes of Might and Magic III',
    publisher: 'The 3DO Company',
    releaseDate: new Date(1999, 1, 28),
    genre: 'Turn based strategy',
    metascore: 87,
    coverImg: 'Homm3boxart.jpg',
  }),
  new GameModel({
    title: 'Diablo II',
    publisher: 'Blizzard Entertainment',
    releaseDate: new Date(2000, 5, 29),
    genre: 'Hack & Slash',
    metascore: 88,
    goty: true,
    coverImg: 'Diablo_II_Coverart.png',
  }),
];

create(games);

const basePath = './src/public/images/';
const defaultFiles = [
  {
    in: 'https://upload.wikimedia.org/wikipedia/en/5/57/Doom_cover_art.jpg',
    out: `${basePath}Doom_cover_art.jpg`,
  },
  {
    in: 'https://upload.wikimedia.org/wikipedia/en/9/9b/Homm3boxart.jpg',
    out: `${basePath}Homm3boxart.jpg`,
  },
  {
    in: 'https://upload.wikimedia.org/wikipedia/en/d/d5/Diablo_II_Coverart.png',
    out: `${basePath}Diablo_II_Coverart.png`,
  },
];

defaultFiles.forEach(file => {
  const stream = fs.createWriteStream(file.out);
  https.get(file.in, response => {
    response.pipe(stream);
  });
});
