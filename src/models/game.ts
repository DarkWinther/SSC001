import { Schema, model } from 'mongoose';
import { ObjectID } from 'bson';

export interface Game {
  _id: ObjectID;
  title: string;
  publisher: string;
  releaseDate: Date;
  genre: string;
  coverImg: string;
}

const GameSchema = new Schema<Game>({
  title: String,
  publisher: String,
  releaseDate: Date,
  genre: String,
  coverImg: String,
});

export const GameModel = model('Game', GameSchema, 'games');
