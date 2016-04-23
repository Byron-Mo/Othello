var Board = require('./board.js');
var Player = require('./player.js');

var Game = function() {
  this.board = new Board();
  this.player1 = new Player(this, "black");
  this.player2 = new Player(this, "white");
  this.currentPlayer = this.player1;
  this.winner = null;
}

// Game.prototype.play = function() {
//   if (!this.board.isGameOver()) {
//     if (this.board.containsValidMove(this.currentPlayer.color)) {
//
//     }
//     this.switchPlayer();
//   }
// }

Game.prototype.playMove = function(coordinates) {
  this.board.addPiece(coordinates[0], coordinates[1], this.currentPlayer.color)
  this.switchPlayer();

  if (!this.board.containsValidMove(this.currentPlayer.color)) {
    this.switchPlayer();
    // add notification that player has switched because no room left
  }
}

Game.prototype.currentPlayerMoves = function() {
  return this.board.validMoves(this.currentPlayer.color)
}

Game.prototype.isOver = function() {
  if (this.board.isGameOver()) {
    if (this.board.blackScore > this.board.whiteScore) {
      this.winner = "Black"
    } else if (this.board.blackScore < this.board.whiteScore) {
      this.winner = "White";
    } else {
      this.winner = "Tie"
    }
    return true;
  } else {
    return false;
  }
}

Game.prototype.switchPlayer = function() {
  if (this.currentPlayer.color === "black") {
    this.currentPlayer = this.player2;
  } else {
    this.currentPlayer = this.player1;
  }
}

Game.prototype.setup = function() {
  this.board.setupBoard();
}

module.exports = Game;
