import { Application } from 'express';
import { getCurrentGame } from '../route-utils';
import { del } from '../mongoose-util/game-crud';
import fs from 'fs';

export const deleteRoute = (app: Application): void => {
  app.get('/delete', async (req, res) => {
    const selected = await getCurrentGame(req);
    if (selected && selected._id) {
      if (selected.coverImg) {
        fs.unlink(`./src/public/images/${selected.coverImg}`, error => {
          if (error) console.error(error);
          console.log(`Deleted file - ${selected.coverImg}`);
        });
      }
      del(selected._id);
    }
    res.redirect('/game');
  });
};
