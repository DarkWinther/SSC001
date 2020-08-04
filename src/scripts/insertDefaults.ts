import { GameModel, IGame } from '../models/game';
import { create } from '../mongoose-util/game-crud';

const games: IGame[] = [
  new GameModel({ title: 'Doom' }),
  new GameModel({ title: 'Legend of Zelda' }),
  new GameModel({ title: 'Heroes of Might and Magic III' }),
  new GameModel({
    title: 'Diablo II',
    coverImg:
      'https://upload.wikimedia.org/wikipedia/en/d/d5/Diablo_II_Coverart.png',
  }),
];

create(games);
