function MatrixCollection() {
  this.matrices = [];
}

MatrixCollection.prototype = {
  lookupMatrixById: function(id) {
    return this.matrices.filter(function(matrix) {
      return matrix.id == id;
    })[0]
  },
  removeMatrixById: function(id) {
    for (var i=0;i<this.matrices.length;i++) {
      if (this.matrices[i].id == id) {
        matrixCollection.matrices.splice(i,1);
        return
      }
    }
  }
}
