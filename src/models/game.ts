import { Schema, model, Document } from 'mongoose';

export interface IGame extends Document {
  title: string;
  publisher?: string;
  releaseDate?: Date;
  genre?: string;
  coverImg?: string;
}

const GameSchema = new Schema({
  title: String,
  publisher: String,
  releaseDate: Date,
  genre: String,
  coverImg: String,
});

export const GameModel = model<IGame>('Game', GameSchema, 'games');
