var express = require('express');
var port = process.env.PORT || 3000;
var path = require('path');
var mongoose = require('mongoose');
var mongoStore = require('connect-mongodb');
var bodyParser = require('body-parser');
var session = require('express-session');
var morgan = require('morgan');
var app = express();
var dbURL = 'mongodb://127.0.0.1/imooc';

mongoose.connect(dbURL);

app.set('views', './app/views/pages');
app.set('view engine', 'jade');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'imooc',
    store: new mongoStore({
        url: dbURL,
        collection: 'sessions'
    })
}));

if('development' === app.get('env')){
    app.set('showStackError', true);
    app.use(morgan(':method :url :status'));
    app.locals.pretty = true;
    mongoose.set('debug', true);
}

require('./config/routes')(app);

app.use(express.static(path.join(__dirname, 'public'))); //配置静态文件目录.
app.locals.moment = require('moment');
app.listen(port);
console.log('imooc started on ' + port);
