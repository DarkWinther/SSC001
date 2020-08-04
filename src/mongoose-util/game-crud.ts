import { IGame, GameModel } from '../models/game';
import { dbConnect, dbDisconnect } from './connect';

export const create = async (
  games: IGame | IGame[]
): Promise<IGame | IGame[]> => {
  await dbConnect();
  if (Array.isArray(games)) {
    const result = await Promise.all(games.map(game => game.save()));
    dbDisconnect();
    return result;
  } else {
    const result = await games.save();
    dbDisconnect();
    return result;
  }
};

export const read = async (_id?: string): Promise<null | IGame | IGame[]> => {
  await dbConnect();
  if (_id) {
    const result = await GameModel.findById(_id);
    dbDisconnect();
    return result;
  } else {
    const result = await GameModel.find();
    dbDisconnect();
    return result;
  }
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
