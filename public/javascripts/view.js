function View(maxDimension) {
  this.maxDimension = maxDimension;
}

View.prototype = {
  // buildMiniSVGHTML: function(matrix, svgId, title) {
  //   console.log('yea')
  //   title = title || "Untitled"
  //   var matrixHTML = "<div class='small-3 columns svg-collection-box' id=\"" + svgId + "\">"
  //   matrixHTML += "<p class='svg-collection-title' >" + title + "</p>"
  //   matrixHTML += "<svg width='200' height='200' class='collection-svg' onclick='loadSVG(\"" + svgId + "\")'>"
  //   matrixHTML += "<rect width='198' height='198' x='0.6' y='0.6' />"
  //   matrixHTML += "<rect width='197.5' x='1.2' y='1.2' fill='grey'/>";

  //   for (var x=0; x < 32; x++) {
  //     for (var y=0; y < 32; y++) {
  //       var rgb = matrix[x][y][0] + ',' + matrix[x][y][1] + ',' + matrix[x][y][2];
  //       matrixHTML += "<circle cx=" + ((x * 6.1) + 5.48) + " cy=" + ((y * 6.1) + 5.48) + " r='2.93' fill='rgb(" + rgb + ")' />";
  //     }
  //   }
  //   matrixHTML += "</svg>";
  //   matrixHTML += "<p class='remove-svg-text' onclick='removeMatrixFromCollection(\"" + svgId + "\")'>X</p>"
  //   matrixHTML += "</div>";
  //   return matrixHTML;
  // },
  buildSVGHTML: function(matrix) {
    var matrixHTML = "<svg width='820' height='820'><rect width='815' height='815' x='2.5' y='2.5' fill='#555555' /><rect width='810' height='810' x='5' y='5' fill='black' />";

    for (var x=0; x < 32; x++) {
      for (var y=0; y < 32; y++) {
        var rgb = matrix[x][y][0] + ',' + matrix[x][y][1] + ',' + matrix[x][y][2];
        matrixHTML += "<circle id=" + x + "-" + y + " cx=" + ((x * 25) + 22.5) + " cy=" + ((y * 25) + 22.5) + " r='12' fill='grey' class='led-circle-outer' />";
        matrixHTML += "<circle id=" + x + "-" + y + " cx=" + ((x * 25) + 22.5) + " cy=" + ((y * 25) + 22.5) + " r='10' fill='rgb(" + rgb + ")' class='led-circle-inner' />";
      }
    }

    matrixHTML += "</svg>";

    return matrixHTML;
  },
  buildCollectionGrid: function(collection) {
    var self = this;
    $(".svg-collection-row").empty();
    var collectionHTML = "<div class='row collection-row'>"
    for (var i=0; i<collection.matrices.length; i++) {
      collectionHTML += collection.matrices[i].buildCollectionSVGHTML();

      if (i == collection.matrices.length - 1) {
        collectionHTML += "</div>";
      }
      if ((i+1) % 4 == 0) {
        collectionHTML += "</div><div class='row collection-row'>";
      }
    }
    $(".svg-collection-row").append(collectionHTML);
  },
  toggleSetSwatch: function() {
    this.settingSwatch = true;
  },
  toggleDropMode: function() {
    this.dropMode = true;
  },
  toggleCustomColorMode: function() {
    this.customColor = true;
  },
  loadCanvas: function() {

  },
  setSelectedColor: function(rgb) {
    $(".selected-color").show();
    $(".selected-color").css({backgroundColor: 'rgb(' + rgb + ')'});
    $(".selected-color").text('Current Color: ' + rgb)
  },
  setBackgroundColorTo: function(element, rgb) {

  },
  setAttrFillTo: function(element, rgb) {

  },
  promptRGB: function() {
    return prompt("What color R,G,B?","RGB").split(",").map(function(e) {
      return parseInt(e);
    });
  }
}
