var RgbMatrix = require('../app/models/rgbMatrix');
var SerialPort = require("serialport");
var portName = '/dev/cu.usbmodem1421';
module.exports = function(app, baseColors) {

  app.get('/', function(req, res) {
    var matrixQuery = RgbMatrix.find();
    matrixQuery.exec(function(err, matrixes) {
      console.log('got matrixes');
      // res.json(matrixes);
      res.render('index.ejs', {
        baseColors: baseColors,
        matrixes: matrixes
      });
    });
  });

  app.get('/matrix_collection', function(req, res) {
    var matrixQuery = RgbMatrix.find();
    matrixQuery.exec(function(err, matrixes) {
      console.log('got matrixes');
      res.json(matrixes);
    });
  });

  app.post('/save', function(req, res) {
    var matrixBody = req.body.matrixBody;
    console.log('saving', matrixBody);

    if (matrixBody.id) { // Update by existing id
      var matrixQuery = RgbMatrix.findById(matrixBody.id);
      matrixQuery.exec(function(err, matrix) {
        var matrixUpdateQuery = matrix.update({
          requestBaseString: matrixBody.requestBaseString,
          title: matrixBody.title
        });

        matrixUpdateQuery.exec(function(err, updatedMatrix) {
          res.send(updatedMatrix);
        })
      })
      console.log('Updated matrix!');
    } else { // Or save new
      var rgbMatrix = new RgbMatrix(matrixBody)
      rgbMatrix.save();
      console.log('Saved new Matrix!')
      res.send(rgbMatrix);
    }
  });

  app.post('/draw', function(req, res) {
    var drawString = req.body.drawString;
    // console.log('Request:', req.body.drawString)
    var serialPort = new SerialPort(portName, {
          baudrate: 9600,
           dataBits: 8,
           parity: 'none',
           stopBits: 1,
           flowControl: false
      });

      serialPort.on("open", function () {
        console.log('open serial communication');
        setTimeout(function() {

          serialPort.write(drawString,function(err) {
            if (err) {
              console.log("error:", err);
              res.send(err);
            }
            console.log('message written')
            res.send('message written');
          });

          setTimeout(function() {
            serialPort.close();
          },8000)
        }, 2000);
      });
  });
};
