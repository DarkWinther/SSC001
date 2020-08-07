import { Application } from 'express';
import { findRandom, read } from '../mongoose-util/game-crud';
import { toSimpleGame, IGame } from '../models/game';
import { isValidObjectId } from 'mongoose';

export const homeRoute = (app: Application): void => {
  app.get('/', async (req, res) => {
    const randomGame = await findRandom();
    return res.render('index', {
      game: toSimpleGame(randomGame),
      page: 'home',
    });
  });

  app.get('/:id', async (req, res) => {
    if (req.params.id && isValidObjectId(req.params.id)) {
      const selected = (await read(req.params.id)) as IGame | null;
      if (selected) {
        return res.render('index', {
          game: toSimpleGame(selected),
          page: 'home',
        });
      }
    }
    return res.redirect('/');
  });
};
