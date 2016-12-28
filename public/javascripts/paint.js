console.log('paint')
var currentColor = [255,0,0];
var currentMatrixIndex = 0;
var matrixCollection;
var settingSwatch = false;
var dropMode = false;
var customColor = false;
var scLogoData = convertSC("0000000111111111110000000000000000000012222222222210000000000000000001222222222222210000000000000000122222222222222210000000000000001222222222222222100000000000000012222111111122221000000000000000122221000001111110000000000000001222210000000000000000000000000012222111111111000000000000000000122222222222221000000000000000000122222222222221000000000000000000122222222222221000000000000000000111111111222210000000000000000000000000012222100000000000000011111000111122221111100000000000122210012221222212222100000000001222111222212222122222100000000012222212222122221222222100000000122222122221222211122221000000001222221222212221001222210000000012222212222122100012222100000000012222122221210000122221000000000011111222211000001111110000000000000012222100000000000000000000000000122221000000111111000000000000001222210000001222210000000000000012222100000012222100000000000000122221111111122221000000000000001222222222222222210000000000000001222222222222221000000000000000001222222222222100000000000000000001111111111110000000");

function convertSC(logoData) {
  var workString = '';

  for (var i=0; i<logoData.length;i++) {
    if (logoData.charAt(i) == "0") {
      workString += "000"
    } else if (logoData.charAt(i) == "1") {
      workString += "750"
    } else if (logoData.charAt(i) == "2") {
      workString += "700"
    }
  }

  return workString;

}

$(document).ready(function() {
  // saveMatrix();
  loadAllMatricies();

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
        $(innerCircle).attr('fill', 'rgb(' + currentColor[0] + ',' + currentColor[1] + ',' + currentColor[2] + ')');
        addCurrentColorToCell(coords[0], coords[1]);
      }
  })

  $(document).on('mouseenter', '.led-circle-inner', function() {
    if(isMouseDown) {
        var coords = this.id.split("-");
        // var innerCircle = $(this).next()[0];
        $(this).attr('fill', 'rgb(' + currentColor[0] + ',' + currentColor[1] + ',' + currentColor[2] + ')');
        addCurrentColorToCell(coords[0], coords[1]);
      }
  })

  $(document).on('click', '.led-circle-outer', function() {
    if (dropMode) {
      var newColor = $(this).attr('fill').match(/\d{1,3},\d{1,3},\d{1,3}/)[0].split(",").map(function(e) {
        return parseInt(e);
      })
      currentColor = newColor;
      dropMode = false;
      $(".selected-color").css({backgroundColor: 'rgb(' + currentColor[0] + ',' + currentColor[1] + ',' + currentColor[2] + ')'});
    } else {
      console.log('clicked', this.id);
      var coords = this.id.split("-");
      var innerCircle = $(this).next()[0];
      addCurrentColorToCell(coords[0], coords[1]);
      $(innerCircle).attr('fill', 'rgb(' + currentColor[0] + ',' + currentColor[1] + ',' + currentColor[2] + ')');
    }
  })

  $(document).on('click', '.led-circle-inner', function() {
    if (dropMode) {
      var newColor = $(this).attr('fill').match(/\d{1,3},\d{1,3},\d{1,3}/)[0].split(",").map(function(e) {
        return parseInt(e);
      })
      currentColor = newColor;
      dropMode = false;
      $(".selected-color").css({backgroundColor: 'rgb(' + currentColor[0] + ',' + currentColor[1] + ',' + currentColor[2] + ')'});
    } else {
      console.log('clicked', this.id);
      var coords = this.id.split("-");
      addCurrentColorToCell(coords[0], coords[1]);
      $(this).attr('fill', 'rgb(' + currentColor[0] + ',' + currentColor[1] + ',' + currentColor[2] + ')');
    }
  })

  $(document).on('click', '.swatch-box', function() {
    // console.log('clicked', this.id);
    // var coords = this.id.split("-");
    // addCurrentColorToCell(coords[0], coords[1]);
    if (settingSwatch) {
      $(this).css('background-color', 'rgb(' + currentColor[0] + ',' + currentColor[1] + ',' + currentColor[2] + ')');
      settingSwatch = false;
    } else if (customColor) {
      var newColor = prompt("What color R,G,B?","RGB").split(",").map(function(e) {
        return parseInt(e);
      });
      if (newColor.length != 3) {
        alert('Error: rgb input incorrect');
      } else {
        currentColor = newColor;
        $(this).css('background-color', 'rgb(' + currentColor[0] + ',' + currentColor[1] + ',' + currentColor[2] + ')');
        $(".selected-color").css({backgroundColor: 'rgb(' + currentColor[0] + ',' + currentColor[1] + ',' + currentColor[2] + ')'});
        console.log('custom color', newColor);
      }
      customColor = false;
    } else {
      var newColor = $(this).css('background-color').match(/\d{1,3}, \d{1,3}, \d{1,3}/)[0].split(", ").map(function(e) {
        return parseInt(e);
      })
      currentColor = newColor;
      $(".selected-color").css({backgroundColor: 'rgb(' + currentColor[0] + ',' + currentColor[1] + ',' + currentColor[2] + ')'});
    }

  })

  $(".color-wheel-select").on("click", function() {
    currentColor = this.id.split("-").map(function(x) {
      return parseInt(x);
    });

    $(".selected-color").show();
    $(".selected-color").css({backgroundColor: 'rgb(' + currentColor[0] + ',' + currentColor[1] + ',' + currentColor[2] + ')'});
    console.log('selected', currentColor);
  })

})

var paintMatrix = {
  matrix: [
    [[0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0]],
    [[0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0]],
    [[0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0]],
    [[0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0]],
    [[0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0]],
    [[0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0]],
    [[0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0]],
    [[0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0]],
    [[0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0]],
    [[0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0]],
    [[0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0]],
    [[0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0]],
    [[0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0]],
    [[0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0]],
    [[0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0]],
    [[0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0]],
    [[0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0]],
    [[0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0]],
    [[0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0]],
    [[0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0]],
    [[0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0]],
    [[0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0]],
    [[0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0]],
    [[0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0]],
    [[0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0]],
    [[0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0]],
    [[0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0]],
    [[0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0]],
    [[0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0]],
    [[0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0]],
    [[0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0]],
    [[0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0]]
  ],
  requestBaseString: ''
};

function addCurrentColorToCell(x,y) {
  console.log('before', paintMatrix.matrix[x][y])
  paintMatrix.matrix[x][y] = currentColor;
  console.log('updated', paintMatrix.matrix[x][y])
}

function buildBase255Matrix(base7String) {
  var baseArray = base7String.split('');
  var workingArray = [];
  var matrixIndex = 0;

  for (var x=0; x< 32; x++) {
    var rowArray = [];
    for (var y=0; y< 32; y++) {
      var r = convertBase7ToBase255(baseArray[matrixIndex])
      var g = convertBase7ToBase255(baseArray[matrixIndex + 1])
      var b = convertBase7ToBase255(baseArray[matrixIndex + 2])
      matrixIndex += 3;
      rowArray.push([r,g,b])
    }
    workingArray.push(rowArray);
  }

  return workingArray;
}

function convertBase7ToBase255(val) {
  return Math.round((val / 7) * 255);
}

function buildMiniSVGHTML(matrix, svgId) {
  var matrixHTML = "<div class='small-3 columns svg-collection-box' onclick='loadSVG(\"" + svgId + "\")'><svg width='200' height='200'><rect width='198' height='198' x='0.6' y='0.6' /><rect width='197.5' x='1.2' y='1.2' fill='grey'/>";

  for (var x=0; x < 32; x++) {
    for (var y=0; y < 32; y++) {
      var rgb = matrix[x][y][0] + ',' + matrix[x][y][1] + ',' + matrix[x][y][2];
      matrixHTML += "<circle cx=" + ((x * 6.1) + 5.48) + " cy=" + ((y * 6.1) + 5.48) + " r='2.93' fill='rgb(" + rgb + ")' />";
    }
  }
  matrixHTML += "</svg></div>";
  return matrixHTML;
}

function buildSVGHTML(matrix) {
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
}

function buildScaleSVGHTML(matrix, maxDimension) {
  var matrixHTML = "<svg width='" + (maxDimension * 1) + "' height='" + (maxDimension * 1) + "'>"
  matrixHTML += "<rect width='" + (maxDimension * .994) + "' height='" + (maxDimension * .994) + "' x='" + (maxDimension * .003) + "' y='" + (maxDimension * .003) + "' fill='#555555' />"
  matrixHTML += "<rect width='" + (maxDimension * .988) + "' height='" + (maxDimension * .988) + "' x='" + (maxDimension * .006) + "' y='" + (maxDimension * .006) + "' fill='black' />";

  for (var x=0; x < 32; x++) {
    for (var y=0; y < 32; y++) {
      var rgb = matrix[x][y][0] + ',' + matrix[x][y][1] + ',' + matrix[x][y][2];
      matrixHTML += "<circle id=" + x + "-" + y + " cx=" + ((x * (maxDimension * .031)) + (maxDimension * .022)) + " cy=" + ((y * (maxDimension * .031)) + (maxDimension * .022)) + " r='" + (maxDimension * .015) + "' fill='grey' class='led-circle-outer' />";
      matrixHTML += "<circle id=" + x + "-" + y + " cx=" + ((x * (maxDimension * .031)) + (maxDimension * .022)) + " cy=" + ((y * (maxDimension * .031)) + (maxDimension * .022)) + " r='" + (maxDimension * .012) + "' fill='rgb(" + rgb + ")' class='led-circle-inner' />";
    }
  }

  matrixHTML += "</svg>";

  return matrixHTML;
}

function loadCurrentMatrix() {
  $(".paint-canvas-row").empty();
  var newMatrix = buildBase255Matrix(matrixCollection[currentMatrixIndex].requestBaseString);
  paintMatrix.matrix = newMatrix;
  paintMatrix.id =  matrixCollection[currentMatrixIndex]._id
  var matrixHTML = buildPaintCanvasHTML(newMatrix)
  $(".paint-canvas-row").append(matrixHTML);
  console.log('loaded matrix')
}

function showMiniMatrix(baseString) {
  $(".matrix-collection-row").empty();
  var newMatrix = buildBase255Matrix(baseString);
  var miniMatrixHTML = buildMiniMatrixTableHTML(newMatrix);
  $(".matrix-collection-row").append(miniMatrixHTML);
}

function appendSVGMatrix(baseString, svgId) {
  var newMatrix = buildBase255Matrix(baseString);
  // var newArray = newMatrix[0].map(function(col, i) {
  //   return newMatrix.map(function(row) {
  //     return row[i]
  //   })
  // });
  var svgMatrixHTML = buildMiniSVGHTML(newMatrix, svgId);
  $(".svg-collection-row").append(svgMatrixHTML);
}

function appendScaleSVGMatrix(baseString) {
  var newMatrix = buildBase255Matrix(baseString);
  var svgMatrixHTML = buildScaleSVGHTML(newMatrix, 1000);
  $(".svg-collection-row").append(svgMatrixHTML);
}

function flattenAndConvertMatrixToBase7(matrix) {
  return [].concat.apply([],[].concat.apply([], matrix)).map(function(e) {
    return Math.round((parseInt(e) / 255) * 7)
  });
}

function scrollNextMatrix() {
  currentMatrixIndex++;
  showMiniMatrix(matrixCollection[currentMatrixIndex].requestBaseString);
}

function scrollPreviousMatrix() {
  if (currentMatrixIndex >= 0) {
    currentMatrixIndex--;
    showMiniMatrix(matrixCollection[currentMatrixIndex].requestBaseString);
  } else {
    alert("At 0 index");
  }
}



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

function toggleSetSwatch() {
  settingSwatch = true;
}

function toggleDropMode() {
  dropMode = true;
}

function toggleCustomColorMode() {
  customColor = true;
}

// function activateSwatch() {
//   if (settingSwatch) {

//   }
// }

function saveMatrix() {
  var currentTitle = $("#working-board-title").val();
  console.log('title', currentTitle);
  var matrixToSave = paintMatrix;
  matrixToSave.requestBaseString = flattenAndConvertMatrixToBase7(matrixToSave.matrix).toString().replace(/,/g,"");
  matrixToSave.matrix = undefined;
  matrixToSave.title = currentTitle;


  var request = $.ajax({
    method: 'POST',
    url: '/save',
    dataType: 'json',
    data: { matrixBody: matrixToSave}
  });
  request.done(function( matrix ) {
    alert('Matrix Saved!' + matrix._id, matrix);
  });

  request.fail(function( jqXHR, textStatus ) {
    console.log( "Request failed: " + textStatus );
    alert('Saved Failed!');
  });

}

function loadSVG(id) {
  console.log('loading SVG', id);
  var currentSVG = lookupMatrixCollectionById(id);
  $(".working-board").empty();
  var newMatrix = buildBase255Matrix(currentSVG.requestBaseString);

  // var newArray = newMatrix[0].map(function(col, i) {
  //   return newMatrix.map(function(row) {
  //     return row[i]
  //   })
  // });
  // var newBaseString = flattenAndConvertMatrixToBase7(newArray).toString().replace(/,/g,"");

  paintMatrix.matrix = newMatrix;
  paintMatrix.id =  id
  paintMatrix.requestBaseString = currentSVG.requestBaseString;
  var matrixHTML = buildSVGHTML(newMatrix)

  $(".working-board").append(matrixHTML);
}

function lookupMatrixCollectionById(id) {
  return matrixCollection.find(function(element) {
    return element._id == id;
  })
}

function buildCollectionGrid() {
  var collectionHTML = "<div class='row'>"
  for (var i=0; i<matrixCollection.length; i++) {
    if (i == matrixCollection - 1) {
      collectionHTML += "</"
    }
    if (i % 4 == 0) {
      collectionHTML += "</div><div class='row'>"
    }
  }

}

function loadAllMatricies() {
  $.get('/matrix_collection', function(data, status) {
    console.log('got matrices', data);
    console.log('status', status);
    matrixCollection = data;
    // appendScaleSVGMatrix(data[1].requestBaseString)
    for (var i=0; i<4; i++) {
      if (data[i]) {
        appendSVGMatrix(data[i].requestBaseString, data[i]._id);
      }
    }
  })
}

