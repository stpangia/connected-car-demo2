var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var dotenv = require('dotenv').load();
var Promise = require('bluebird');
var sqlite = require('sqlite');

var index = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: {maxAge: 31536000000}
}));

// SQLite init and force migrations on first run
var dbPromise = Promise.resolve()
  .then(() => sqlite.open('./database.sqlite', { Promise }))
  //.then(db => db.migrate({ force: 'last' }));
  // 'down' block doesn't seem to execute in migrations, so I'm doing it manually (because this is only a demo app)
  .then( function(db){
    db.run('DROP TABLE IF EXISTS migrations');
    db.run('DROP TABLE IF EXISTS users');
    db.run('DROP TABLE IF EXISTS vehicles');
    db.migrate({ force: 'last' });
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
