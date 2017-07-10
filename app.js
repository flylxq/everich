'use strict';
require('ts-node/register');

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

const client = require('./routes/client');
const index = require('./routes/index');
const login = require('./routes/login');
const dataRouter = require('./routes/data');

var app = express();
if(app.get('env') == 'development') {
    const webpack = require('webpack');
    const webpackConfig = require('./webpack.config.ts');
    const compiler = webpack(webpackConfig);
    const webpackDevMiddleware = require("webpack-dev-middleware");
    app.use(webpackDevMiddleware(compiler, {
        publicPath: '/public/dist'
    }));
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// favicon
app.use(favicon(path.resolve(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const UserAuth = require('./common/UserAuth.ts');
app.use(UserAuth.filter);

// routers
app.use('/client', client);
app.use('/index', index);
app.use('/login', login);
app.use('/data', dataRouter);
app.use('/checkUser', UserAuth.checkUser);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        console.log(err);
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
    console.log(err);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
