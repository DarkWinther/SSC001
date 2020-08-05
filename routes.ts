import { Router, Request } from 'express';
import { GameModel, toSimpleGame, ISimpleGame, IGame } from './src/models/game';
import { create, read, findRandom } from './src/mongoose-util/game-crud';
import { isValidObjectId } from 'mongoose';

interface GameError {
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

const hasValue = (body: Record<string, string>): GameError =>
  Object.entries(body).reduce(
    (total, [key, val]) => ({ ...total, [key]: !!val }),
    {}
  );

const validate = (body: Record<string, string>) => {
  const errors = hasValue(body);
  if (errors) {
    errors.title = !errors?.title; // Skal være udfyldt
    errors.publisher = !errors?.publisher; // Skal være udfyldt
    // errors.metascore = !errors?.metascore || parseInt(body.metascore) < 1; // Skal være udfyldt og større end 1
  }
  return errors;
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

export default (app: Router): void => {
  app.get('/', async (req, res) => {
    const randomGame = await findRandom();
    return res.render('index', { game: toSimpleGame(randomGame) });
  });

  app.get('/game', async (req, res) => {
    const allGames = ((await read()) || []) as IGame[];
    return res.render('pages/allGames', {
      games: allGames.map(game => toSimpleGame(game)),
    });
  });

  app.get('/edit', async (req, res) => {
    const selected = await getCurrentGame(req);
    return res.render('pages/editGame', { current: selected });
  });

  // app.post('/', async (req, res) => {
  //   const rootState = await getRootState(req);

  //   if (!Object.values(validate(req.body)).includes(true)) {
  //     const obj: ISimpleGame = Object.entries({
  //       title: req.body.title,
  //       publisher: req.body.publisher,
  //       releaseDate: req.body.releaseDate && new Date(req.body.releaseDate),
  //       genre: req.body.genre,
  //       metascore: !isNaN(parseInt(req.body.metascore))
  //         ? parseInt(req.body.metascore)
  //         : undefined,
  //       goty: !!req.body.goty,
  //     })
  //       .filter(([k, v]) => !!v)
  //       .reduce((total, [key, val]) => ({ ...total, [key]: val }), {});

  //     create(new GameModel(obj));
  //   }
  //   res.render('index', rootState);
  // });

  app.get('*', (req, res) => res.send('404 Error'));
};
