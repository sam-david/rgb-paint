function Controller() {
  this.settingSwatch = false;
  this.dropMode = false;
  this.customColor = false;
}

Controller.prototype = {
  sendMatrix: function() {
    console.log('Sending to arduino:', currentMatrix)
    var base7String = currentMatrix.convertBase255MatrixToBase7String();
    var request = $.ajax({
      method: 'POST',
      url: '/draw',
      dataType: 'json',
      data: { drawString: base7String}

    });
    request.done(function( msg ) {
      console.log(msg)
    });

    request.fail(function( jqXHR, textStatus ) {
      console.log( "Request failed: " + textStatus );
    });
  },
  loadAndSaveMatricies: function(collection, callback) {
    var self = this;
    $.get('/matrix_collection', function(dataCollection, status) {
      self.saveToCollection(collection, dataCollection, callback);
    })
  },
  saveToCollection: function(collection, dataCollection, callback) {
    dataCollection.forEach(function(dataMatrix) {
      collection.matrices.push(new Matrix({
        title: dataMatrix.title,
        requestBaseString: dataMatrix.requestBaseString,
        id: dataMatrix._id
      }));
    })

    callback(collection)
    console.log('final data matrix!', matrixCollection)
  },
  loadNewCurrentMatrix(id) {
    var newMatrix = matrixCollection.lookupMatrixById(id)
    currentMatrix = newMatrix;
    var identifier = currentMatrix.title || currentMatrix.id;
    alertify.message('Loaded matrix: ' + identifier);
    console.log('loaded matrix' ,currentMatrix);
    $(".working-board").empty();
    $("#working-board-title").val(currentMatrix.title);
    $(".working-board").append(currentMatrix.buildSVGHTML());
    window.scroll(0,30);
  },
  saveCurrentMatrix() {
    var self = this;
    alertify.message('Saving/Updating Current Matrix');
    console.log('saving current matrix', currentMatrix)
    var currentTitle = $("#working-board-title").val();

    // refresh base 7 string
    var base7String = currentMatrix.convertBase255MatrixToBase7String();

    var matrixToPost = {
      matrix: undefined,
      requestBaseString: base7String,
      title: currentTitle,
      id: currentMatrix.id
    }

    var request = $.ajax({
      method: 'POST',
      url: '/save',
      dataType: 'json',
      data: { matrixBody: matrixToPost}
    });
    request.done(function( matrix ) {
      if (matrix.title) {
        console.log('Matrix Saved!' + matrix._id, matrix);
        alertify.success('Matrix Saved!');
        matrixCollection.matrices.push(new Matrix({
          title: matrix.title,
          requestBaseString: matrix.requestBaseString,
          id: matrix._id
        }));
        if (currentMatrix.id == "") { currentMatrix.id = matrix._id; }
        if (currentMatrix.title == "") { currentMatrix.title = matrix.title; }
        pageView.buildCollectionGrid(matrixCollection);
      } else {
        alertify.success('Matrix Updated!');
        console.log("Matrix updated!");
      }
    });

    request.fail(function( jqXHR, textStatus ) {
      console.log( "Request failed: " + textStatus );
      alert('Saved Failed!');
      alertify.error('Saved Failed');
    });
  },
   removeMatrixFromCollection(id) {
    var response = confirm("Are you sure you want to delete matrix: " + id)
    if (response) {
      this.deleteMatrix(id);
      matrixCollection.removeMatrixById(id);
      pageView.buildCollectionGrid(matrixCollection);
    }
  },
  deleteMatrix: function(id) {
      var request = $.ajax({
      method: 'DELETE',
      url: '/matrix_collection',
      dataType: 'json',
      data: { id: id}
    });
    request.done(function( matrix ) {
      // alert('Matrix Deleted!' + matrix._id, matrix);
      console.log('Matrix deleted', matrix)
    });

    request.fail(function( jqXHR, textStatus ) {
      console.log( "Request failed: " + textStatus );
      alert('Delete Failed!');
    });
  },
  toggleSetSwatch: function() {
    alertify.message('Select a swatch');
    this.settingSwatch = true;
  },
  toggleDropMode: function() {
    alertify.message('Pick a board node');
    this.dropMode = true;
  },
  toggleCustomColorMode: function() {
    alertify.message('Pick a swatch');
    this.customColor = true;
  },
  jsColorChange: function(picker) {
    console.log('jsco', picker)
    console.log('rgb', picker.toRGBString())
    var newColor = parseStringToArray(picker.toRGBString());
    currentRGB.setColors(newColor[0], newColor[1], newColor[2])
    $('.jscolor').val(currentRGB.toString())
    pageView.setSelectedColor(currentRGB.toString());
  }
}

function parseStringToArray(str) {
  return str.match(/\d{1,3},[ ]?\d{1,3},[ ]?\d{1,3}/)[0].split(",").map(function(e) {
      return parseInt(e);
    })
}
