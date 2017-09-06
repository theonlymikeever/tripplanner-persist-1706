const app = require('express').Router();
const db = require('../db');
const { Day, Hotel, Restaurant, Activity, Place } = db.models;

app.get('/', (req, res, next)=> {
  Day.findAll({
    order: [ 'id' ],
    include: [
      { model: Hotel, include: [ Place ] },
      { model: Restaurant, include: [ Place ] },
      { model: Activity, include: [ Place ] }
    ]
  })
  .then( days => {
    res.send(days);
  })
  .catch(next);
});

//Days
app.post('/', (req, res, next)=> {
  Day.create({})
    .then( day => {
      res.send(day);
    });
});

app.delete('/:id', (req, res, next)=> {
  const id = req.params.id;
  Day.destroy({where: {id}})
  .then(() => res.sendStatus(200))
  .catch(next);
});

// adding item
app.post('/:dayId/:key/:id', (req, res, next) => {
  const dayId = req.params.dayId;
  const itemId = req.params.id;
  const key = req.params.key;

  Day.addItem(dayId, itemId, key)
  .then(() => {
    res.sendStatus(201);
  })
  .catch(next);
});

module.exports = app;

// Deleting item
app.delete('/:dayId/:key/:id', (req, res, next) => {
  const dayId = req.params.dayId;
  const itemId = req.params.id;
  const key = req.params.key;

  Day.removeItem(dayId, itemId, key)
  .then(() => {
    res.sendStatus(201);
  })
  .catch(next);
});

module.exports = app;
