var express = require('express');
var router = express.Router();


// "Database". Names of places, and whether the user has visited it or not.

//var places = [
//{id: "1", name: "Rome", visited: true},
//{id: "2", name: "New York", visited: false},
//{id: "3", name: "Tokyo", visited: false}
//];
//var counter = places.length;


/* GET home page. */
router.get('/', function(req, res, next) {
  req.db.collection('places').find().toArray(function (err, places)
    {
        if (err) {
            return next(err)
        }
        return res.render('index', {title: 'Travel Wish List', places: places});
    });
});


/* GET all items home page. */
router.get('/all', function(req, res) {
  res.json(places);
});


/* POST - add a new location */
router.post('/add', function(req, res, next) {
    req.db.collection('places').insertOne(req.body, function(err){
        if (err) {
            return next(err);
        }
        var name = req.body.name;
        var counter = places.length;
        var place = { 'id': ++counter + "" , 'name': name, 'visited': false };

        return places.push(place);

    });

  //var name = req.body.name;
  //var place = { 'id': ++counter + "" , 'name': name, 'visited': false };

 // places.push(place);

  console.log('After POST, the places list is');
  console.log(places);

  res.status(201);      // Created
  res.json(place);      // Send new object data back as JSON, if needed.

  // TODO may want to check if place already in list and don't add.

});


/* PUT - update whether a place has been visited or not */
router.put('/update', function(req, res){

  var id = req.body.id;
  var visited = req.body.visited == "true";  // all the body parameters are strings

  for (var i = 0 ; i < places.length ; i++) {
    var place = places[i];
    if (place.id == id) {
      place.visited = visited;
      places[i] = place;
    }
  }

  console.log('After PUT, the places list is');
  console.log(places);

  res.json(place);

});


router.delete('/delete', function(req, res){

  var place_id = req.body.id;
  console.log(place_id);

  for (var i = 0 ; i < places.length ; i++) {
    var place = places[i];
    if (place.id == place_id) {
      places.splice(i, 1);  //Delete the element at this position
      res.json(place);
      break;
    }
  }

  console.log('After DELETE, the places list is');
  console.log(places);

  res.status(200);
  res.end();

});



module.exports = router;
