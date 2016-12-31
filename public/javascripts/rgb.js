function RGB(r, g, b) {
  this.r = r || 0;
  this.g = g || 0;
  this.b = b || 0;
}

RGB.prototype = {
  setColors: function(r,g,b) {
    this.r = r;
    this.g = g;
    this.b = b;
  },
  toString: function() {
    return this.r + "," + this.g + "," + this.b;
  }
}
