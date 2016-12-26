
exports.allColorsBase7 = function() {
  var rgbs = [];
  for (var r=1; r<8; r++) {
    for (var g=1; g<8; g++) {
      for (var b=1; b<8; b++) {
        rgbs.push([r,g,b]);
      }
    }
  }
  return rgbs;
}

exports.allColorsBase255 = function() {
  var base7 = exports.allColorsBase7();

  var base255 = [];

  for (var i=0; i<base7.length; i++) {
    var r = Math.round((base7[i][0] / 7) * 255)
    var g = Math.round((base7[i][1] / 7) * 255)
    var b = Math.round((base7[i][2] / 7) * 255)
    base255.push([r,g,b]);
  }

  return base255;
}
