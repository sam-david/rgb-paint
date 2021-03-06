var RgbMatrix = require('../app/models/rgbMatrix');

// if (process.env.ENABLE_SERIAL) {
//   var SerialPort = require("serialport");
//   var portName = '/dev/cu.usbmodem1421';
// }

module.exports = function(app, baseColors, serialPort) {

  app.get('/', function(req, res) {
    var matrixQuery = RgbMatrix.find();
    matrixQuery.exec(function(err, matrices) {
      console.log('got matrices');
      // res.json(matrices);
      res.render('index.ejs', {
        baseColors: baseColors,
        matrices: matrices
      });
    });
  });

  app.get('/project', function(req, res) {
    res.render('project.ejs');
  });

  app.get('/matrix_collection', function(req, res) {
    var matrixQuery = RgbMatrix.find();
    matrixQuery.exec(function(err, matrices) {
      console.log('got matrices');
      res.json(matrices);
    });
  });

  app.delete('/matrix_collection', function(req, res) {
    var matrixId = req.body.id
    console.log('deleteing', matrixId);
    var matrixQuery = RgbMatrix.findById(matrixId);
      matrixQuery.exec(function(err, matrix) {
        matrix.remove();
        res.json(matrixId);
        // matrixUpdateQuery.exec(function(err, updatedMatrix) {
        //   res.send(updatedMatrix);
        // })
      })
  });

  app.post('/save', function(req, res) {
    var matrixBody = req.body.matrixBody;
    console.log('saving/updating', matrixBody.id);

    if (matrixBody.id) { // Update by existing id
      var matrixQuery = RgbMatrix.findById(matrixBody.id);
      matrixQuery.exec(function(err, matrix) {
        var matrixUpdateQuery = matrix.update({
          requestBaseString: matrixBody.requestBaseString,
          title: matrixBody.title
        });

        matrixUpdateQuery.exec(function(err, updatedMatrix) {
          console.log('Updated Matrix!', updatedMatrix)
          console.log('err', err)
          console.log('matrix', matrix.title)
          debugger
          res.json(updatedMatrix);
        })
      })
    } else { // Or save new
      var rgbMatrix = new RgbMatrix(matrixBody)
      rgbMatrix.save();
      console.log('Saved new Matrix!')
      res.json(rgbMatrix);
    }
  });

  app.post('/draw', function(req, res) {
    if (process.env.ENABLE_SERIAL) {
      var drawString = req.body.drawString;
      // console.log('drawing', drawString)

      serialPort.write(drawString,function(err) {
        if (err) {
          console.log("error:", err);
          res.send(err);
        }
        console.log('message written')
        res.send('message written');
      });
    } else {
      res.send('No matrix connected to draw to')
    }
  });
};
