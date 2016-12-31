function View(maxDimension) {
  this.maxDimension = maxDimension;
}

View.prototype = {
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
    $(element).css('background-color', 'rgb(' + rgb + ')');
  },
  setAttrFillTo: function(element, rgb) {
    $(element).attr('fill', 'rgb(' + rgb + ')');
  },
  promptRGB: function() {
    return prompt("What color R,G,B?","RGB").split(",").map(function(e) {
      return parseInt(e);
    });
  }
}
