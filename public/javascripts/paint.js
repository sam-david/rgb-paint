var currentColor = [255,0,0];

var currentRGB = new RGB(255,0,0);

$(document).ready(function() {
  isMouseDown = false

  $(document).on('mousedown', function() {
        isMouseDown = true;
    })
  .mouseup(function() {
      isMouseDown = false;
  });

  $(document).on('mouseenter', '.led-circle-outer', function() {
    if(isMouseDown) {
        var coords = this.id.split("-");
        var innerCircle = $(this).next()[0];
        $(innerCircle).attr('fill', 'rgb(' + currentRGB.toString() + ')');
        currentMatrix.addColorToCell(coords[0], coords[1], currentRGB.r, currentRGB.g, currentRGB.b)
      }
  })

  $(document).on('mouseenter', '.led-circle-inner', function() {
    if(isMouseDown) {
        var coords = this.id.split("-");
        $(this).attr('fill', 'rgb(' + currentRGB.toString() + ')');
        currentMatrix.addColorToCell(coords[0], coords[1], currentRGB.r, currentRGB.g, currentRGB.b)
      }
  })

  $(document).on('click', '.led-circle-outer', function() {
    if (pageController.dropMode) {
      var newColor = parseStringToArray($(this).attr('fill'))

      currentRGB.setColors(newColor[0], newColor[1], newColor[2])
      pageController.dropMode = false;
      pageView.setSelectedColor(currentRGB.toString())
    } else {
      var coords = this.id.split("-");
      var innerCircle = $(this).next()[0];
      currentMatrix.addColorToCell(coords[0], coords[1], currentRGB.r, currentRGB.g, currentRGB.b)
      $(innerCircle).attr('fill', 'rgb(' + currentRGB.toString() + ')');
    }
  })

  $(document).on('click', '.led-circle-inner', function() {
    if (pageController.dropMode) {
      var newColor = parseStringToArray($(this).attr('fill'))
      currentRGB.setColors(newColor[0], newColor[1], newColor[2])
      pageController.dropMode = false;
      pageView.setSelectedColor(currentRGB.toString());
    } else {
      console.log('clicked', this.id);
      var coords = this.id.split("-");
      currentMatrix.addColorToCell(coords[0], coords[1], currentRGB.r, currentRGB.g, currentRGB.b)
      $(this).attr('fill', 'rgb(' + currentRGB.toString() + ')');
    }
  })


  $(document).on('click', '.swatch-box', function() {
    if (pageController.settingSwatch) {
      $(this).css('background-color', 'rgb(' + currentRGB.toString() + ')');
      pageController.settingSwatch = false;
    } else if (pageController.customColor) {
      var newColor = prompt("What color R,G,B?","RGB").split(",").map(function(e) {
        return parseInt(e);
      });
      if (newColor.length != 3) {
        alert('Error: rgb input incorrect');
      } else {
        currentRGB.setColors(newColor[0], newColor[1], newColor[2])
        $(this).css('background-color', 'rgb(' + currentRGB.toString() + ')');
        pageView.setSelectedColor(currentRGB.toString());
        console.log('custom color', newColor);
      }
      pageController.customColor = false;
    } else {
      var newColor = parseStringToArray($(this).css('background-color'))

      currentRGB.setColors(newColor[0], newColor[1], newColor[2])
      pageView.setSelectedColor(currentRGB.toString());
    }

  })

  $(".color-wheel-select").on("click", function() {
    var newColor = parseColorId(this.id)

    currentRGB.setColors(newColor[0], newColor[1], newColor[2])
    pageView.setSelectedColor(currentRGB.toString());
    console.log('selected RGB:', currentRGB);
  })

})

function parseStringToArray(str) {
  return str.match(/\d{1,3},[ ]?\d{1,3},[ ]?\d{1,3}/)[0].split(",").map(function(e) {
      return parseInt(e);
    })
}

function parseColorId(id) {
  return id.split("-").map(function(x) {
    return parseInt(x);
  });
}


var matrixCollection = new MatrixCollection;

var pageView = new View(820);

var currentMatrix = new Matrix({
  matrix: pageData.emptyMatrix
});

var pageController = new Controller();
pageController.loadAndSaveMatricies(matrixCollection, pageView.buildCollectionGrid);

// function saveDataToCurrentCollection(dataCollection) {
//   dataCollection.forEach(function(dataMatrix) {
//     console.log(dataMatrix)
//     matrixCollection.matrices.push(new Matrix({
//       title: dataMatrix.title,
//       requestBaseString: dataMatrix.requestBaseString,
//       id: dataMatrix._id
//     }))
//   })
//   console.log('final data matrix!', matrixCollection)
// }



// function removeMatrixFromCollection(id) {
//   var response = confirm("Are you sure you want to delete matrix: " + id)
//   if (response) {
//     deleteMatrix(id);

//     for (var i=0;i<matrixCollection.length;i++) {
//       if (matrixCollection[i]._id == id) {
//         matrixCollection.splice(i,1);
//         buildCollectionGrid();
//         return
//       }
//     }
//   }
// }

// function loadCurrentMatrix() {
//   $(".paint-canvas-row").empty();
//   var newMatrix = buildBase255Matrix(matrixCollection[currentMatrixIndex].requestBaseString);
//   paintMatrix.matrix = newMatrix;
//   paintMatrix.id =  matrixCollection[currentMatrixIndex]._id
//   var matrixHTML = buildPaintCanvasHTML(newMatrix)
//   $(".paint-canvas-row").append(matrixHTML);
//   console.log('loaded matrix')
// }

// function appendSVGMatrix(baseString, svgId) {
//   var newMatrix = buildBase255Matrix(baseString);
//   var svgMatrixHTML = buildMiniSVGHTML(newMatrix, svgId);
//   $(".svg-collection-row").append(svgMatrixHTML);
// }

// function appendScaleSVGMatrix(baseString) {
//   var newMatrix = buildBase255Matrix(baseString);
//   var svgMatrixHTML = buildScaleSVGHTML(newMatrix, 1000);
//   $(".svg-collection-row").append(svgMatrixHTML);
// }

// function flattenAndConvertMatrixToBase7(matrix) {
//   return [].concat.apply([],[].concat.apply([], matrix)).map(function(e) {
//     return Math.round((parseInt(e) / 255) * 7)
//   });
// }





function sendMatrix() {
  // if (paintMatrix.requestBaseString != '') {
  //   var requestBaseString = paintMatrix.requestBaseString;
  // } else {

  // }
  var base7RGB = flattenAndConvertMatrixToBase7(paintMatrix.matrix);
  var requestString = base7RGB.toString().replace(/,/g,"");
  console.log('sending', requestString)
  var request = $.ajax({
    method: 'POST',
    url: '/draw',
    dataType: 'json',
    data: { drawString: requestString}

  });
  request.done(function( msg ) {
    console.log(msg)
  });

  request.fail(function( jqXHR, textStatus ) {
    console.log( "Request failed: " + textStatus );
  });
}

// function toggleSetSwatch() {
//   settingSwatch = true;
// }

// function toggleDropMode() {
//   dropMode = true;
// }

// function toggleCustomColorMode() {
//   customColor = true;
// }

// function deleteMatrix(id) {
//   var request = $.ajax({
//     method: 'DELETE',
//     url: '/matrix_collection',
//     dataType: 'json',
//     data: { id: id}
//   });
//   request.done(function( matrix ) {
//     // alert('Matrix Deleted!' + matrix._id, matrix);
//     console.log('Matrix deleted', matrix)
//   });

//   request.fail(function( jqXHR, textStatus ) {
//     console.log( "Request failed: " + textStatus );
//     alert('Delete Failed!');
//   });
// }

// function saveMatrix() {
//   var currentTitle = $("#working-board-title").val();
//   console.log('title', currentTitle);

//   debugger
//   var matrixToSave = paintMatrix;
//   matrixToSave.matrix = undefined;
//   matrixToSave.requestBaseString = flattenAndConvertMatrixToBase7(paintMatrix.matrix).toString().replace(/,/g,"");
//   matrixToSave.title = currentTitle;


//   var request = $.ajax({
//     method: 'POST',
//     url: '/save',
//     dataType: 'json',
//     data: { matrixBody: matrixToSave}
//   });
//   request.done(function( matrix ) {
//     alert('Matrix Saved!' + matrix._id, matrix);
//     matrixCollection.push(matrix);
//     buildCollectionGrid();
//   });

//   request.fail(function( jqXHR, textStatus ) {
//     console.log( "Request failed: " + textStatus );
//     alert('Saved Failed!');
//   });

// }

// function loadSVG(id) {
//   console.log('loading SVG', id);
//   var currentSVG = lookupMatrixCollectionById(id);
//   $(".working-board").empty();
//   var newMatrix = buildBase255Matrix(currentSVG.requestBaseString);

//   paintMatrix.matrix = newMatrix;
//   paintMatrix.id =  id
//   paintMatrix.requestBaseString = currentSVG.requestBaseString;
//   var matrixHTML = buildSVGHTML(newMatrix)

//   $(".working-board").append(matrixHTML);
//   window.scroll(0,30);
// }

// function lookupMatrixCollectionById(id) {
//   return matrixCollection.find(function(element) {
//     return element._id == id;
//   })
// }

// function buildCollectionGrid() {
//   $(".svg-collection-row").empty();
//   var collectionHTML = "<div class='row collection-row'>"
//   for (var i=0; i<matrixCollection.length; i++) {
//     // collectionHTML += buildMiniSVGHTML(matrix)
//     var newMatrix = buildBase255Matrix(matrixCollection[i].requestBaseString);
//     collectionHTML += buildMiniSVGHTML(newMatrix, matrixCollection[i]._id, matrixCollection[i].title);
//     if (i == matrixCollection.length - 1) {
//       collectionHTML += "</div>";
//     }
//     if ((i+1) % 4 == 0) {
//       collectionHTML += "</div><div class='row collection-row'>";
//     }
//   }
//   $(".svg-collection-row").append(collectionHTML);
// }

// function loadAllMatricies() {
//   $.get('/matrix_collection', function(data, status) {
//     console.log('got matrices', data);
//     matrixCollection = data;
//     buildCollectionGrid();
//   })
// }



// function buildSVGHTML(matrix) {
//   var matrixHTML = "<svg width='820' height='820'><rect width='815' height='815' x='2.5' y='2.5' fill='#555555' /><rect width='810' height='810' x='5' y='5' fill='black' />";

//   for (var x=0; x < 32; x++) {
//     for (var y=0; y < 32; y++) {
//       var rgb = matrix[x][y][0] + ',' + matrix[x][y][1] + ',' + matrix[x][y][2];
//       matrixHTML += "<circle id=" + x + "-" + y + " cx=" + ((x * 25) + 22.5) + " cy=" + ((y * 25) + 22.5) + " r='12' fill='grey' class='led-circle-outer' />";
//       matrixHTML += "<circle id=" + x + "-" + y + " cx=" + ((x * 25) + 22.5) + " cy=" + ((y * 25) + 22.5) + " r='10' fill='rgb(" + rgb + ")' class='led-circle-inner' />";
//     }
//   }

//   matrixHTML += "</svg>";

//   return matrixHTML;
// }

// function buildScaleSVGHTML(matrix, maxDimension) {
//   var matrixHTML = "<svg width='" + (maxDimension * 1) + "' height='" + (maxDimension * 1) + "'>"
//   matrixHTML += "<rect width='" + (maxDimension * .994) + "' height='" + (maxDimension * .994) + "' x='" + (maxDimension * .003) + "' y='" + (maxDimension * .003) + "' fill='#555555' />"
//   matrixHTML += "<rect width='" + (maxDimension * .988) + "' height='" + (maxDimension * .988) + "' x='" + (maxDimension * .006) + "' y='" + (maxDimension * .006) + "' fill='black' />";

//   for (var x=0; x < 32; x++) {
//     for (var y=0; y < 32; y++) {
//       var rgb = matrix[x][y][0] + ',' + matrix[x][y][1] + ',' + matrix[x][y][2];
//       matrixHTML += "<circle id=" + x + "-" + y + " cx=" + ((x * (maxDimension * .031)) + (maxDimension * .022)) + " cy=" + ((y * (maxDimension * .031)) + (maxDimension * .022)) + " r='" + (maxDimension * .015) + "' fill='grey' class='led-circle-outer' />";
//       matrixHTML += "<circle id=" + x + "-" + y + " cx=" + ((x * (maxDimension * .031)) + (maxDimension * .022)) + " cy=" + ((y * (maxDimension * .031)) + (maxDimension * .022)) + " r='" + (maxDimension * .012) + "' fill='rgb(" + rgb + ")' class='led-circle-inner' />";
//     }
//   }

//   matrixHTML += "</svg>";

//   return matrixHTML;
// }
