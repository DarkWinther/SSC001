import { Schema, model, Document } from 'mongoose';

export interface ISimpleGame {
  _id?: string;
  title?: string;
  publisher?: string;
  releaseDate?: Date;
  releaseDateInpStr?: string;
  genre?: string;
  metascore?: number;
  goty?: boolean;
  coverImg?: string;
}

export interface IGame extends Document {
  title?: string;
  publisher?: string;
  releaseDate?: Date;
  genre?: string;
  metascore?: number;
  goty?: boolean;
  coverImg?: string;
}

const GameSchema = new Schema({
  title: String,
  publisher: String,
  releaseDate: Date,
  genre: String,
  metascore: Number,
  goty: Boolean,
  coverImg: String,
});

export const GameModel = model<IGame>('Game', GameSchema, 'games');

export const toSimpleGame = (game?: IGame | null): ISimpleGame => {
  if (!game) return {};
  let dateStr = '';
  if (game.releaseDate) {
    const newDate = new Date(game.releaseDate);
    dateStr = `${newDate.getFullYear()}-${String.prototype.padStart.call(
      newDate.getMonth() + 1,
      2,
      '0'
    )}-${String.prototype.padStart.call(newDate.getDate(), 2, '0')}`;
  }
  return Object.entries({
    _id: game._id,
    title: game.title,
    publisher: game.publisher,
    releaseDate: game.releaseDate,
    releaseDateInpStr: dateStr,
    genre: game.genre,
    metascore: game.metascore,
    goty: typeof game.goty === 'boolean' ? game.goty : game.goty === 'on',
    coverImg: game.coverImg,
  })
    .filter(([, val]) => !!val)
    .reduce((total, [key, val]) => ({ ...total, [key]: val }), {});
};
