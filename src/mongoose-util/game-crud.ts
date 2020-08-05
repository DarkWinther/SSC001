import { IGame, GameModel } from '../models/game';
import { dbConnect, dbDisconnect } from './connect';

export const create = async (
  games: IGame | IGame[]
): Promise<IGame | IGame[]> => {
  await dbConnect();
  let result: IGame | IGame[];
  if (Array.isArray(games)) {
    result = await Promise.all(games.map(game => game.save()));
  } else {
    result = await games.save();
  }
  dbDisconnect();
  return result;
};

export const read = async (_id?: string): Promise<null | IGame | IGame[]> => {
  await dbConnect();
  let result: null | IGame | IGame[];
  if (_id) {
    result = await GameModel.findById(_id);
  } else {
    result = await GameModel.find();
  }
  dbDisconnect();
  return result;
};

export const findRandom = async (): Promise<IGame | null> => {
  await dbConnect();
  const count = await GameModel.estimatedDocumentCount();
  const random = Math.floor(Math.random() * count);
  const result = await GameModel.findOne().skip(random);
  dbDisconnect();
  return result;
};

export const update = async (game: IGame): Promise<void> => {
  await dbConnect();
  await game.replaceOne(game);
  dbDisconnect();
};

export const del = async (_id: string): Promise<boolean> => {
  await dbConnect();
  const result = await GameModel.deleteOne({ _id });
  dbDisconnect();
  return !!(result.ok && result.deletedCount && result.deletedCount > 0);
};
