var express = require('express');
var router = express.Router();
var ObjectID = require('mongodb').ObjectID;



// "Database". Names of places, and whether the user has visited it or not.

//var places = [
//{id: "1", name: "Rome", visited: true},
//{id: "2", name: "New York", visited: false},
//{id: "3", name: "Tokyo", visited: false}
//];
//var counter = places.length;
//when entered location has a _id but front end expecting id so these two functions convert the ids
function translateId(obj) {
    obj.id = obj._id;
    delete obj._id;
    return obj;
}

function untranslateId(obj) {
    obj._id = ObjectID(obj.id);
    delete obj.id;
    return obj;
}

/* GET home page. */
router.get('/', function(req, res, next) {
  req.db.collection('places').find().toArray(function (err, places)
    {
        if (err) {
            return next(err)
        }
        return res.render('index', {layout: 'layout', title: 'Travel Wish List'});
    });
});


/* GET all items home page. */
//display travel locations
router.get('/all', function(req, res) {

    req.db.collection('places').find().toArray(function (err, places)
    {
        if (err) {
            return next(err)
        }
        res.json(places.map(translateId));
    });
});


/* POST - add a new location */
//also adds to database
router.post('/add', function(req, res, next) {
    req.db.collection('places').insertOne(req.body, function(err){
        if (err) {
            return next(err);
        }
        res.status(201);      // Created
        res.json(translateId(req.body));      // Send new object data back as JSON, if needed.

    });
});


/* PUT - update whether a place has been visited or not */
router.put('/update', function(req, res, next){
    var update = { $set : { visited : req.body.visited == "true" }};  // all the body parameters are strings
    req.db.collection('places').findOneAndUpdate(untranslateId(req.body), update, function(err, place)
    {
        if (err) {
            return next(err);
        }
        res.json(translateId(place));
    });
});

//delete button working
//removes from database
router.delete('/delete', function(req, res, next){

    req.db.collection('places').remove(untranslateId(req.body), function(err){
        if (err) {
            return next(err);
        }
        res.status(200);
        res.json(translateId(req.body));
    });

});



module.exports = router;
