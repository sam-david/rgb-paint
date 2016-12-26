var mongoose = require('mongoose');
var rgbMatrixSchema = new mongoose.Schema({
  matrix: [Number],
  requestBaseString: String,
  createdAt: {type: Date, default: Date.now}
})

module.exports = mongoose.model('rgbMatrix', rgbMatrixSchema);
