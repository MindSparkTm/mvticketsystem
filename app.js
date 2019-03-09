var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport');

var indexRouter = require('./routes/index');
var ticketRouter = require('./routes/create_ticket');
var loginRouter = require('./routes/login');
var signupRouter = require('./routes/signup');
var chatRouter = require('./routes/chatfrontend')
var session = require('express-session')

var smsRouter = require('./routes/sms');
var dbconfig = require('./configs/dbconfig')



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('view engine','hbs')
dbconfig.dbcoonection()

app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/sms', smsRouter);
app.use('/tickettype', ticketRouter);
app.use('/support', loginRouter);
app.use('/mv', signupRouter);
app.use('/startchat', chatRouter);


const port=4000
// server = app.listen(port, () => console.log(`Example app listening on port ${port}!`))

var http = require('http').Server(app);
var io = require('socket.io')(http);

http.listen(4000, function () {
  console.log('Express server listening on port %d in %s mode', 4000);
});




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





//listen on every connection
io.on('connection', function(socket) {
  console.log('New user connected')

  //default username
  socket.username = "Anonymous"

  //listen on change_username
  socket.on('change_username',function (data) {
    socket.username = data.username

  })

  //listen on new_message
  socket.on('new_message', function(data){
    //broadcast the new message
    console.log('message',data)
    io.sockets.emit('new_message', {message : data.message, username : socket.username});
  })

  //listen on typing
  socket.on('typing', function(data){
    socket.broadcast.emit('typing', {username : socket.username})
  })
})



var hbs = require('hbs');
hbs.registerPartials(__dirname + '/views/partials');


module.exports = app;
