var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var hbs = require('express-handlebars');
var assert = require('assert');
//requires to use mongo db
var MongoClient = require('mongodb').MongoClient;
var index = require('./routes/index');

var app = express();
//connects to mongo database
var mongo_pw = process.env.MONGO_PW;
var mongo_user = process.env.MONGO_USER;
var schoolUrl = 'mongodb://localhost:27017/locations';
var homeUrl = 'mongodb://' + mongo_user + ':' + mongo_pw + '@localhost:27017/locations';
var url = schoolUrl;
var db;
MongoClient.connect(url, function(err, database) {
    assert.equal(null, err);
    console.log('connected to MongoDB');
    db = database;
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', hbs({ extname : '.hbs'}));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//add db to request
app.use('/', function(req, res, next){
    req.db = db;
    next();
});
app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
