var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// New Code
var monk = require('monk');
var db = monk('localhost:27017/SGRA');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var projectsRouter = require('./routes/projects');
var requirementsRouter = require('./routes/requirements');
var messagesRouter = require('./routes/messages');
var materialsRouter = require('./routes/materials');
var auditsRouter = require('./routes/audits');
var projectMaterialsRouter = require('./routes/projectMaterials');
var projectRequirementsRouter = require('./routes/projectRequirements');
var inboxRouter = require('./routes/inbox');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Make our db accessible to our router
app.use(function(req,res,next){
  req.db = db;
  next();
});
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/projects', projectsRouter);
app.use('/requirements', requirementsRouter);
app.use('/messages', messagesRouter);
app.use('/materials', materialsRouter);
app.use('/audits', auditsRouter);
app.use('/projectMaterials', projectMaterialsRouter);
app.use('/projectRequirements', projectRequirementsRouter);
app.use('/inbox', inboxRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
