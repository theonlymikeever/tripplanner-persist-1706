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

//TO DO - total of six routes, add and remove hotels, restaurants, activities for a day

//Adding & Deleting Restaurants
app.post('/:dayId/restaurants/:id', (req, res, next)=> {
  let dayId = req.params.dayId;
  let restaurantId = req.params.id;
  let restaurant = Restaurant.findOne({where: { id: restaurantId }})
  let day = Day.findOne({where: { id: dayId }})

  Promise.all([ day, restaurant ])
    .then(([ _day, _restaurant ]) => {
      return _day.addRestaurant(_restaurant)
    })
    .then(() => {
      res.sendStatus(201)
    })
    .catch(next)
});

app.delete('/:dayId/restaurants/:id', (req, res, next)=> {
    let dayId = req.params.dayId;
    let restaurantsId = req.params.id;

  Day.removeItem(dayId, restaurantsId, Restaurant)
  .then(() => {
    res.sendStatus(201);
  })
  .catch(next)

    // Promise.all([
    //   Day.findById(dayId),
    //   Restaurant.findById(restaurantsId)
    // ])
    // .then(([day, restaurant]) => {
    //   return day.removeRestaurant(restaurant)
    // })
    // .then(() => {
    //   res.sendStatus(201)
    // })
    // .catch(next);
});

// Adding and Deleting Hotel
app.post('/:dayId/hotels/:id', (req, res, next)=> {
  let dayId = req.params.dayId;
  let hotelId = req.params.id;
  let hotel = Hotel.findOne({where: { id: hotelId }})
  let day = Day.findOne({where: { id: dayId }})

  Promise.all([ day, hotel ])
    .then(([ _day, _hotel ]) => {
      return _day.addHotel(_hotel)
    })
    .then(() => {
      res.sendStatus(201)
    })
    .catch(next)
});

app.delete('/:dayId/hotels/:id', (req, res, next)=> {
  let dayId = req.params.dayId;
  let hotelId = req.params.id;

  Day.removeItem(dayId, hotelId, Hotel)
  .then(() => {
    res.sendStatus(201);
  })
  .catch(next)

  // Promise.all([
  //   Day.findById(dayId),
  //   Hotel.findById(hotelId)
  // ])
  // .then(([day, hotel]) => {
  //   return day.removeHotel(hotel)
  // })
  // .then(() => {
  //   res.sendStatus(201)
  // })
  // .catch(next);

});

// Adding and Deleting Activity
app.post('/:dayId/activities/:id', (req, res, next)=> {
  let dayId = req.params.dayId;
  let activityId = req.params.id;
  let activity = Activity.findOne({where: { id: activityId }})
  let day = Day.findOne({where: { id: dayId }})

  Promise.all([ day, activity ])
    .then(([ _day, _activity ]) => {
      return _day.addActivity(_activity)
    })
    .then(() => {
      res.sendStatus(201)
    })
    .catch(next)
});

app.delete('/:dayId/activities/:id', (req, res, next)=> {
    let dayId = req.params.dayId;
    let activitiesId = req.params.id;


  Day.removeItem(dayId, activitiesId, Activity)
  .then(() => {
    res.sendStatus(201);
  })
  .catch(next)
  // Day.findOne({
  //   where: {
  //     id: dayId
  //   },
  //   include: [{
  //     model: Activity,
  //     where: {
  //       id: activitiesId
  //     }
  //   }]
  // })
  // .then((day) => {
  //   //include should only return the one activity in an array
  //   return day.removeActivity(day.activities[0])
  // })
  // .then(() => {
  //   res.sendStatus(201)
  // })
  // .catch(next);
});

module.exports = app;
