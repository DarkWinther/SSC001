import { Router } from 'express';

const handleError = (body: Record<string, string>) => {
  const result: Record<string, boolean> = {};

  if (!body.text) {
    result.noText = true;
  }
  if (!body.num || isNaN(parseInt(body.num)) || parseInt(body.num) <= 0) {
    result.noNum = true;
  }
  if (!body.isTrue || body.isTrue === 'off') {
    result.notTrue = true;
  }
  return result;
};

export default (app: Router): void => {
  app.get('/', (req, res) =>
    res.render('index', {
      // tekst: 'Min besked',
      // arr: ['one', 'two', 'three'],
      page: 'home',
    })
  );
  app.post('/', (req, res) => {
    console.log(handleError(req.body));
    res.render('index', {
      tekst: req.body.text,
      num: req.body.num,
      isTrue: req.body.isTrue,
      error: handleError(req.body),
      page: 'home',
    });
  });
  // app.get('/test', (req, res) => res.render('index', {
  //   arr: ['one', 'two', 'three'],
  //   page: 'test',
  // }));
  // app.get('/test/:id', (req, res) => {
  //   console.log(req.query);
  //   return res.render('index', {
  //     arr: ['one', 'two', 'three'],
  //     id: req.params.id,
  //     page: 'test'
  //   })
  // })
  app.get('*', (req, res) => res.send('404 Error'));
};
