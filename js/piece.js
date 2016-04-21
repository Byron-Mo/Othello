var Piece = function(color) {
  this.color = color;
}

Piece.prototype.flip = function() {
  if (this.color === "white") {
    this.color = "black";
  } else {
    this.color = "white"
  }
}

module.exports = Piece;
