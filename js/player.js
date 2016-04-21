var Player = function(game, color) {
  this.color = color;
}

Player.prototype.addPiece = function(row, col) {
  game.board.addPiece(row, col, this.color)
}

module.exports = Player;
