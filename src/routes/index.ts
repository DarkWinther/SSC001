import { Application } from 'express';
import { homeRoute } from './home';
import { gameRoute } from './game';
import { editRoute } from './edit';
import { deleteRoute } from './delete';
import { notFoundPage } from './404';

export const initRoutes = (app: Application): void => {
  gameRoute(app);
  editRoute(app);
  deleteRoute(app);
  homeRoute(app);
  notFoundPage(app);
};
