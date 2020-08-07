import { Request } from 'express';
import { ISimpleGame, toSimpleGame, IGame } from './models/game';
import { isValidObjectId } from 'mongoose';
import { read } from './mongoose-util/game-crud';
import { UploadedFile } from 'express-fileupload';
import fs from 'fs';

interface GameError {
  hasError: boolean;
  title?: string;
  publisher?: string;
  releaseDate?: string;
  genre?: string;
  metascore?: string;
  goty?: string;
}

export const validate = (game: Record<string, unknown>): GameError => {
  const REQUIRED_FIELDS: (keyof Omit<GameError, 'hasError'>)[] = [
    'title',
    'publisher',
  ];
  const isString = (str: unknown): str is string => {
    if (typeof str !== 'string') {
      return false;
    }
    for (const char of str) {
      if (isNaN(parseInt(char))) {
        return true;
      }
    }
    return false;
  };

  const errors: GameError = { hasError: false };

  REQUIRED_FIELDS.forEach(field => {
    if (!game[field]) {
      errors.hasError = true;
      errors[field] = 'Dette felt skal udfyldes';
    }
  });

  if (game.title && (typeof game.title !== 'string' || !isString(game.title))) {
    errors.hasError = true;
    errors.title = 'Title skal være en string';
  }

  if (
    game.publisher &&
    (typeof game.publisher !== 'string' || !isString(game.publisher))
  ) {
    errors.hasError = true;
    errors.publisher = 'Publisher skal være en string';
  }

  if (
    game.releaseDate &&
    typeof game.releaseDate === 'string' &&
    isNaN(Date.parse(game.releaseDate))
  ) {
    errors.hasError = true;
    errors.releaseDate = 'Ugyldig dato';
  } else if (
    game.releaseDate &&
    typeof game.releaseDate === 'string' &&
    new Date(game.releaseDate).valueOf() > Date.now().valueOf()
  ) {
    errors.hasError = true;
    errors.releaseDate = 'Du kan ikke angive en release date i fremtiden';
  }

  if (game.genre && (typeof game.genre !== 'string' || !isString(game.genre))) {
    errors.hasError = true;
    errors.genre = 'Genre skal være en string';
  }

  if (
    game.metascore &&
    ((typeof game.metascore === 'string' && isNaN(parseInt(game.metascore))) ||
      typeof game.metascore !== 'number')
  ) {
    errors.hasError = true;
    errors.metascore = 'Metascore skal være et tal';
  } else if (
    game.metascore &&
    ((typeof game.metascore === 'string' &&
      !isNaN(parseInt(game.metascore)) &&
      parseInt(game.metascore) <= 0) ||
      (typeof game.metascore === 'number' && game.metascore <= 0))
  ) {
    errors.hasError = true;
    errors.metascore = 'Metascore skal være større end nul';
  }

  if (game.goty && typeof game.goty !== 'boolean') {
    errors.hasError = true;
    errors.goty = 'Game of the year skal være enten true eller false';
  }

  return errors;
};

export const getCurrentGame = async (
  req: Request
): Promise<ISimpleGame | null> => {
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

export const uploadFile = (req: Request, prevName?: string): void => {
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
      fs.unlink(path, error => {
        if (error) console.error(error);
        console.log(`Deleted file - ${prevName}`);
        moveFile(image);
      });
    } else {
      moveFile(image);
    }
  }
};
