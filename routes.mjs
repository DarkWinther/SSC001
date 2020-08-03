export default (app) => {
  app.get('/', (req, res) => res.render('index', {
    tekst: 'Min besked',
    arr: ['one', 'two', 'three'],
    page: 'home',
  }));
  app.post('/', (req, res) => {
    console.log(req.body);
    res.render('index', {
      tekst: req.body.text,
      num: req.body.num,
      isTrue: req.body.isTrue,
      page: 'home',
    })
  })
  app.get('/test', (req, res) => res.render('index', {
    arr: ['one', 'two', 'three'],
    page: 'test',
  }));
  // app.get('/test/:id', (req, res) => {
  //   console.log(req.query);
  //   return res.render('index', {
  //     arr: ['one', 'two', 'three'],
  //     id: req.params.id,
  //     page: 'test'
  //   })
  // })
  app.get('*', (req, res) => res.send('404 Error'));
}
