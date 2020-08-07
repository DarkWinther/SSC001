import { Application } from 'express';

export const notFoundPage = (app: Application): void => {
  app.get('*', (req, res) => res.send('404 Error'));
};
