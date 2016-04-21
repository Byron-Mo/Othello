var Board = function() {
  this.grid = [];
  for (var i = 0; i < 10; i ++) {
    var arr = []
    for (var j = 0; j < 10; j++) {
      arr.push(null)
    }
    this.grid.push(arr)
  }
}

Board.prototype.addPiece = function(row, col, color) {
  if (this.grid[row][col] === null) {
    this.grid[row][col] = new Piece(color)
  } else {
    console.log("can't do this")
  }
}
