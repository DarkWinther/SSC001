import { Application } from 'express';
import { getCurrentGame, validate, uploadFile } from '../route-utils';
import { toSimpleGame, GameModel } from '../models/game';
import { update, create } from '../mongoose-util/game-crud';
import { UploadedFile } from 'express-fileupload';

export const editRoute = (app: Application): void => {
  app.get('/edit', async (req, res) => {
    const selected = await getCurrentGame(req);
    return res.render('pages/edit-game', { current: selected, page: 'edit' });
  });

  app.post('/edit', async (req, res) => {
    const selected = await getCurrentGame(req);
    // Hvis brugeren har valgt at ændre et spil
    if (selected) {
      const updatedGame = {
        ...toSimpleGame(req.body),
        _id: selected._id,
        coverImg:
          selected.coverImg || (req.files?.coverImg as UploadedFile)?.name,
      };
      const validation = validate(updatedGame);

      if (!validation.hasError) {
        uploadFile(req, selected.coverImg);
        await update(new GameModel(updatedGame));
      }
      return res.render('pages/edit-game', {
        current: updatedGame,
        page: 'edit',
        error: validation,
      });
    }

    // Hvis brugeren har valgt at oprette et spil
    const newGame = {
      ...toSimpleGame(req.body),
      coverImg: (req.files?.coverImg as UploadedFile)?.name,
    };
    const validation = validate(newGame);

    if (!validation.hasError) {
      uploadFile(req);
      create(new GameModel(newGame));
    }
    return res.render('pages/edit-game', {
      current: newGame,
      page: 'edit',
      error: validation,
    });
  });
};
