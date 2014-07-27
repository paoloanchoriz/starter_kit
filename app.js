// dependencies
var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var expressValidator = require('express-validator');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/starter_kit');

var routes = require('./routes/init');

// Create instance of the app
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Favicon?
app.use(favicon());
//TODO[PAO]: implement logging in the future
app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

// Move to another file
app.use(expressValidator({
    errorFormater : function(param, msg, value) {
        var namespace = param.split('.'), 
            root = namespace.shift(),
            formParam = root;

        while(namespace.length) {
          formParam += '[' + namespace.shift() + ']';
        }

        return {
          param : formParam,
          msg   : msg,
          value : value
        };
    }
}));

app.use(cookieParser());

//TODO[PAO]: Will use redis connect in future implementation
app.use(session({ 
        secret: 'joy lyn is a pig',
        rolling: true,
        resave: true,
        saveUninitialized: true
    })
);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components', express.static(__dirname, 'bower_components'));

routes.initRouters(app);

//TODO[PAO]: move system handling to another file
/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    res.error('Not Found!');
    res.redirect('/');
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.listen(8888, function() {
    console.log('Now listening @ 8080')
});
