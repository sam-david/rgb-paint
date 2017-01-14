$(document).ready(function() {
  isMouseDown = false


  setInterval(function() {
    if (pageController.serialEnabled && pageController.serialLiveMode) {
      console.log('Sending matrix');
      // pageController.socketSendMatrix();
    }
  }, 4500);

  // setInterval(function() {
  //   console.log('emit');
  //   socket.emit('draw_matrix', { kingStringALing: 'data' });

  // }, 200);

  // socket.on('news', function (data) {
  //   console.log(data);
  // });

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

        pageView.setAttrFillTo(innerCircle, currentRGB.toString())
        currentMatrix.addColorToCell(coords[0], coords[1], currentRGB.r, currentRGB.g, currentRGB.b)
        // console.log('event', currentMatrix)
        // pageController.socketSendCellUpdate(coords[0],coords[1]);
      }
  })

  $(document).on('mouseenter', '.led-circle-inner', function() {
    if(isMouseDown) {
        var coords = this.id.split("-");

        pageView.setAttrFillTo(this, currentRGB.toString())
        currentMatrix.addColorToCell(coords[0], coords[1], currentRGB.r, currentRGB.g, currentRGB.b)
        // pageController.socketSendCellUpdate(coords[0],coords[1]);
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
      pageView.setAttrFillTo(innerCircle, currentRGB.toString())
      // pageController.socketSendCellUpdate(coords[0],coords[1]);
    }
  })

  $(document).on('click', '.led-circle-inner', function() {
    if (pageController.dropMode) {
      var newColor = parseStringToArray($(this).attr('fill'))

      currentRGB.setColors(newColor[0], newColor[1], newColor[2])
      pageController.dropMode = false;
      pageView.setSelectedColor(currentRGB.toString());
    } else {
      var coords = this.id.split("-");

      currentMatrix.addColorToCell(coords[0], coords[1], currentRGB.r, currentRGB.g, currentRGB.b)
      pageView.setAttrFillTo(this, currentRGB.toString())
      // pageController.socketSendCellUpdate(coords[0],coords[1]);
    }
  })


  $(document).on('click', '.swatch-box', function() {
    if (pageController.settingSwatch) {
      // $(this).css('background-color', 'rgb(' + currentRGB.toString() + ')');
      pageView.setBackgroundColorTo(this, currentRGB.toString())
      pageController.settingSwatch = false;
    } else if (pageController.customColor) {
      var newColor = pageView.promptRGB();
      if (newColor.length != 3) {
        console.log('Error: rgb input incorrect', newColor);
        alertify.error('RGB input incorrect');
      } else {
        currentRGB.setColors(newColor[0], newColor[1], newColor[2])
        // $(this).css('background-color', 'rgb(' + currentRGB.toString() + ')');
        pageView.setBackgroundColorTo(this, currentRGB.toString())
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
