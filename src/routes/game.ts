import { Application } from 'express';
import { read } from '../mongoose-util/game-crud';
import { toSimpleGame, IGame } from '../models/game';

export const gameRoute = (app: Application): void => {
  app.get('/game', async (req, res) => {
    const allGames = ((await read()) || []) as IGame[];
    return res.render('pages/all-games', {
      games: allGames.map(game => toSimpleGame(game)),
      page: 'game',
    });
  });
};
