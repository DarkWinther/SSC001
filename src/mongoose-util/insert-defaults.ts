import { GameModel, IGame } from '../models/game';
import { create } from './game-crud';

const games: IGame[] = [
  new GameModel({
    title: 'Doom',
    publisher: 'id Software',
    releaseDate: new Date(1993, 11, 10),
    genre: 'FPS',
    goty: true,
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
  }),
  new GameModel({
    title: 'Diablo II',
    publisher: 'Blizzard Entertainment',
    releaseDate: new Date(2000, 5, 29),
    genre: 'Hack & Slash',
    metascore: 88,
    goty: true,
  }),
];

create(games);
