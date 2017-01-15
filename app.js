var port     = process.env.PORT || 8080;
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var path     = require('path');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var SerialPort = require('serialport');

var serialCellQueue = [];
var serialWriting = false;

// creating the parser and piping can be shortened to

var baseColors = require(__dirname + '/rgb').allColorsBase255();

if (process.env.ENABLE_SERIAL) {
  var SerialPort = require("serialport");
  var portName = '/dev/cu.usbmodem1421';
  var serialPort = new SerialPort(portName, {
      baudrate: 9600,
     dataBits: 8,
     parity: 'none',
     stopBits: 1,
     flowControl: false
  });

  serialPort.on("open", function () {
    console.log('open serial communication');
  });

  serialPort.on("data", function(data) {
    var dataString = data.toString('utf8');
    console.log('GOT DATA STRING: ', dataString);

    if (dataString == 'W') {
      serialWriting = false;
    }
  })

  setInterval(function() {
    console.log('QUEUE: ', serialCellQueue.length, 'WR: ', serialWriting);
    if (serialCellQueue.length > 0 && !serialWriting) {
      var cellData = serialCellQueue.shift();
      console.log('Writing', cellData);
      writeCellToMatrix(cellData);
    }
  }, 100)
}



io.on('connection', function(socket){
 console.log('connected! socket')
 socket.on('draw_matrix', function(data) {
  console.log('Writing matrix to Arduino', data.base7String);
  serialPort.write(data.base7String,function(err) {
    if (err) {
      console.log("error:", err);
    }
    console.log('Matrix written');
  });
 });

 socket.on('update_cell', function(cellData) {
    serialCellQueue.push(cellData);
 });

});

function writeCellToMatrix(cellData) {
  serialWriting = true;
  console.log('Sending matrix cell UPDATE to Arduino', cellData);
  var cellXString = cellData.x.toString();
  var cellYString = cellData.y.toString();
  if (cellXString.length > 1) {
    var printX = cellXString;
  } else {
    var printX = "0" + cellXString;
  }
  if (cellYString.length > 1) {
    var printY = cellYString;
  } else {
    var printY = "0" + cellYString;
  }
  var updateString = "U" + printX + printY + cellData.rgb;
  serialPort.write(updateString,function(err) {
    if (err) {
      console.log("error:", err);
    }
    console.log('Update string written');
  });
}

// io.on('draw_matrix', function() {
//   console.log('drawing that matrix b');
// });

// connect db
if (process.env.ENVIRONMENT == 'production') {
  var configDbURL = process.env.DATABASE_URL;
} else {
  var configDbURL = require('./config/database.js').url;
}
mongoose.connect(configDbURL);

app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

app.use(express.static(__dirname + '/public'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));

// Set up express
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

require('./app/routes.js')(app, baseColors, serialPort);


// app.listen(port);


server.listen(port)
console.log('server is running on port: ' + port);
