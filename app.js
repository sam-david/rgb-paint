var express  = require('express');
var app      = express();
var path     = require('path');
var port     = process.env.PORT || 8080;
var portName = '/dev/cu.usbmodem1421';
var mongoose = require('mongoose');
// var SerialPort = require("serialport");
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var baseColors = require('./rgb').allColorsBase255();

// connect db
var configDB = require('./config/database.js');
mongoose.connect(configDB.url);

app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

app.use(express.static(__dirname + '/public'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));

// Set up express
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

require('./app/routes.js')(app, baseColors);


app.listen(port);
console.log('server is running on port: ' + port);
