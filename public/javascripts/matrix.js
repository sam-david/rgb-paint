function Matrix(args = {}) {
  this.title = args.title || '';
  this.requestBaseString = args.requestBaseString || '';
  this.matrix = args.matrix || [];
  this.id = args.id || '';
}

Matrix.prototype = {
  buildBase255Matrix: function(base7String) {
    var workString = "";
    if (this.requestBaseString == '' && !base7String) {
      console.log("No base 7 string provided");
      return
    } else if (base7String) {
      // TODO: check length, validate
      workString = base7String;
    } else if (this.requestBaseString != '') {
      workString = this.requestBaseString;
    } else {
      console.log("No base 7 string provided");
      return
    }

    var baseArray = workString.split('');
    var workingArray = [];
    var matrixIndex = 0;

    for (var x=0; x< 32; x++) {
      var rowArray = [];
      for (var y=0; y< 32; y++) {
        var r = this.convertBase7ToBase255(baseArray[matrixIndex])
        var g = this.convertBase7ToBase255(baseArray[matrixIndex + 1])
        var b = this.convertBase7ToBase255(baseArray[matrixIndex + 2])
        matrixIndex += 3;
        rowArray.push([r,g,b])
      }
      workingArray.push(rowArray);
    }

    if (this.matrix.length == 0) { this.matrix = workingArray }

    return workingArray;
  },
  convertBase7ToBase255: function(val) {
    return Math.round((val / 7) * 255);
  },
  addColorToCell: function(x,y,r,g,b) {
    this.matrix[x][y] = [r,g,b];
  },
  convertBase255MatrixToBase7String: function() {
    var base7String = [].concat.apply([],[].concat.apply([], this.matrix)).map(function(e) {
      return Math.round((parseInt(e) / 255) * 7)
    }).toString().replace(/,/g,"");

    this.requestBaseString = base7String;
    return base7String;
  },
  transposeMatrix: function() {
    return this.matrix[0].map(function(col, i) {
      return this.matrix.map(function(row) {
        return row[i]
      })
    });
  },
  buildCollectionSVGHTML: function() {
    if (this.matrix.length == 0) {
      this.buildBase255Matrix();
    }
    var title = this.title || "Untitled"
    var matrixHTML = "<div class='small-3 columns svg-collection-box' id=\"" + this.id + "\">"
    matrixHTML += "<p class='svg-collection-title' >" + title + "</p>"
    matrixHTML += "<svg width='200' height='200' class='collection-svg' onclick='pageController.loadNewCurrentMatrix(\"" + this.id + "\")'>"
    matrixHTML += "<rect width='198' height='198' x='0.6' y='0.6' />"
    matrixHTML += "<rect width='197.5' x='1.2' y='1.2' fill='grey'/>";

    for (var x=0; x < 32; x++) {
      for (var y=0; y < 32; y++) {
        var rgb = this.matrix[x][y][0] + ',' + this.matrix[x][y][1] + ',' + this.matrix[x][y][2];
        matrixHTML += "<circle cx=" + ((x * 6.1) + 5.48) + " cy=" + ((y * 6.1) + 5.48) + " r='2.93' fill='rgb(" + rgb + ")' />";
      }
    }
    matrixHTML += "</svg>";
    if (pageController.currentEnvironment == 'development') { // controller dependancy
      matrixHTML += "</br><a class='remove-svg-text' onclick='pageController.removeMatrixFromCollection(\"" + this.id + "\")'>"
      matrixHTML += "<i class='fa fa-times-circle remove-svg-icon' aria-hidden='true'></i>"
      matrixHTML += "</a>"
    }
    matrixHTML += "</div>";
    return matrixHTML;
  },
  buildSVGHTML: function() {
    var matrixHTML = "<svg width='820' height='820' class='working-board-svg'><rect width='815' height='815' x='2.5' y='2.5' fill='#555555' /><rect width='810' height='810' x='5' y='5' fill='black' />";

    for (var x=0; x < 32; x++) {
      for (var y=0; y < 32; y++) {
        var rgb = this.matrix[x][y][0] + ',' + this.matrix[x][y][1] + ',' + this.matrix[x][y][2];
        matrixHTML += "<circle id=" + x + "-" + y + " cx=" + ((x * 25) + 22.5) + " cy=" + ((y * 25) + 22.5) + " r='12' fill='grey' class='led-circle-outer' />";
        matrixHTML += "<circle id=" + x + "-" + y + " cx=" + ((x * 25) + 22.5) + " cy=" + ((y * 25) + 22.5) + " r='10' fill='rgb(" + rgb + ")' class='led-circle-inner' />";
      }
    }

    matrixHTML += "</svg>";

    return matrixHTML;
  }
}
