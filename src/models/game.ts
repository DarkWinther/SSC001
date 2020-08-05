import { Schema, model, Document } from 'mongoose';

export interface ISimpleGame {
  _id?: string;
  title?: string;
  publisher?: string;
  releaseDate?: Date;
  genre?: string;
  metascore?: number;
  goty?: boolean;
}

export interface IGame extends Document {
  title?: string;
  publisher?: string;
  releaseDate?: Date;
  genre?: string;
  metascore?: number;
  goty?: boolean;
}

const GameSchema = new Schema({
  title: String,
  publisher: String,
  releaseDate: Date,
  genre: String,
  metascore: Number,
  goty: Boolean,
});

export const GameModel = model<IGame>('Game', GameSchema, 'games');

export const toSimpleGame = (game?: IGame | null): ISimpleGame => {
  if (!game) return {};
  return Object.entries({
    _id: game._id,
    title: game.title,
    publisher: game.publisher,
    releaseDate: game.releaseDate,
    genre: game.genre,
    metascore: game.metascore,
    goty: game.goty,
  })
    .filter(([, val]) => !!val)
    .reduce((total, [key, val]) => ({ ...total, [key]: val }), {});
};
