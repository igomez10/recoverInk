var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors')
var redis = require('redis')

var app = express();
app.use(cors()) // Use this after the variable declaration
// create a new redis client and connect to our local redis instance
var client = redis.createClient();
// if an error occurs, print it to the console
client.on('error', function (err) {
     console.log("Error " + err);
});

//app.use(require('express-redis'));
// view engine setup


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//app.use('/', index);
//app.use('/users', users);
app.get('/data/', function (req, res) {
    client.lrange('userScore', 0, 10, function(err, reply) {
            console.log(reply); // ['angularjs', 'backbone']
            res.send({ "data": reply});
    });
//    client.get(key, function(error, result) {

//              if (result) {
                          // the result exists in our cache - return it to our user immediately
//                          res.send({ "userscore": result, "source": "redis cache" });
//                          }else{
//                                res.send('No Data')
//                          }
//    });
});

app.post('/data/:score', function (req, res) {
//    let idx = parseInt(req.body.idx)
    let score =parseInt(req.params.score)
    console.log("req idx " + idx + "and score " + score);
//    res.send('SUCCESS '+(idx+score))
    client.lpush('userScore',score);
});


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

var port = process.env.PORT || 8080;

app.listen(port, function(){
  console.log("listening port " + port)
})


module.exports = app;
