import { Router, Request } from 'express';
import { GameModel, toSimpleGame, ISimpleGame, IGame } from './src/models/game';
import {
  create,
  read,
  findRandom,
  update,
  del,
} from './src/mongoose-util/game-crud';
import { isValidObjectId } from 'mongoose';
import { UploadedFile } from 'express-fileupload';
import fs from 'fs';

interface GameError {
  hasError: boolean;
  title?: boolean;
  publisher?: boolean;
  releaseDate?: boolean;
  genre?: boolean;
  metascore?: boolean;
  goty?: boolean;
}

interface RootState {
  current?: ISimpleGame;
  error?: GameError;
}

const hasValue = (obj: Record<string, unknown>): Record<string, boolean> =>
  Object.entries(obj).reduce(
    (total, [key, val]) => ({ ...total, [key]: !!val }),
    {}
  );

const validate = (game: Record<string, unknown>): GameError => {
  const booleanVals = hasValue(game);
  const errors: Record<string, boolean> = {
    ...{
      title: !booleanVals?.title, // Skal være udfyldt
      publisher: !booleanVals?.publisher, // Skal være udfyldt
      // metascore:
      //   !booleanVals?.metascore || parseInt(game.metascore as string) < 1, // Skal være udfyldt og større end 1
    },
  };
  return {
    ...errors,
    hasError: Object.values(errors).includes(true),
  };
};

const getCurrentGame = async (req: Request): Promise<ISimpleGame | null> => {
  if (req.query.id && isValidObjectId(req.query.id)) {
    let selected: ISimpleGame = {};
    const game = await read(req.query.id.toString());
    if (game) {
      selected = toSimpleGame(game as IGame);
    }
    return selected;
  }
  return null;
};

const uploadFile = (req: Request, prevName?: string) => {
  const moveFile = (file: UploadedFile) => {
    file.mv(`./src/public/images/${file.name}`, err => {
      if (err) console.error(err);
      console.log(`Uploaded file - ${file.name}`);
    });
  };

  if (req.files?.coverImg) {
    const image = req.files.coverImg as UploadedFile;
    if (prevName) {
      const path = `./src/public/images/${prevName}`;
      fs.exists(path, exists => {
        if (exists) {
          fs.unlink(path, error => {
            if (error) console.error(error);
            console.log(`Deleted file - ${prevName}`);
            moveFile(image);
          });
        } else {
          moveFile(image);
        }
      });
    }
  }
};

export default (app: Router): void => {
  app.get('/', async (req, res) => {
    const randomGame = await findRandom();
    return res.render('index', {
      game: toSimpleGame(randomGame),
      page: 'home',
    });
  });

  app.get('/game', async (req, res) => {
    const allGames = ((await read()) || []) as IGame[];
    return res.render('pages/all-games', {
      games: allGames.map(game => toSimpleGame(game)),
      page: 'game',
    });
  });

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
        coverImg: (req.files?.coverImg as UploadedFile)?.name,
      };
      if (!validate(updatedGame).hasError) {
        uploadFile(req, selected.coverImg);
        await update(new GameModel(updatedGame));
      }
      return res.render('pages/edit-game', {
        current: updatedGame,
        page: 'edit',
        error: validate(updatedGame),
      });
    }

    // Hvis brugeren har valgt at oprette et spil
    const newGame = {
      ...toSimpleGame(req.body),
      coverImg: (req.files?.coverImg as UploadedFile)?.name,
    };
    if (!validate(newGame).hasError) {
      uploadFile(req);
      create(new GameModel(newGame));
    }
    return res.render('pages/edit-game', {
      current: newGame,
      page: 'edit',
      error: validate(newGame),
    });
  });

  app.get('/delete', async (req, res) => {
    const selected = await getCurrentGame(req);
    if (selected && selected._id) {
      del(selected._id);
    }
    res.redirect('/game');
  });

  app.get('*', (req, res) => res.send('404 Error'));
};
