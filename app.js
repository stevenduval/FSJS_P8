var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var db = require('./models')
var indexRouter = require('./routes/index');
var booksRouter = require('./routes/books');
const e = require('express');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

(async() => {
  await db.sequelize.sync();
  try {
    await db.sequelize.authenticate();
    console.log('Connection to the database successful!');
  } catch(error) {
    console.error('Error connecting to the database: ', error);
  }
})();

app.use('/', indexRouter);
app.use('/books', booksRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404, 'Sorry! We couldn\'t find the page you were looking for.'));
});

// error handler
app.use(function(err, req, res, next) {
  // set error message
  err.message = err.message || 'Sorry! There was an unexpected error on the server.';

  // render the error page
  res.status(err.status || 500);
  res.render(((err.statusCode === 404)? 'page-not-found' : 'error'), { error: err });
});

module.exports = app;
