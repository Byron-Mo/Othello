var Board = require('./board.js');
var Player = require('./player.js');

var Game = function() {
  this.board = new Board();
  this.player1 = new Player(this, "black");
  this.player2 = new Player(this, "white");
  this.blackScore = this.board.blackScore;
  this.whiteScore = this.board.whiteScore;
  this.currentPlayer = this.player1;
}

Game.prototype.play = function() {
  if (!this.board.isGameOver()) {
    if (this.board.containsValidMove(this.currentPlayer.color)) {

    }
    this.switchPlayer();
  }
}

Game.prototype.playMove = function(coordinates) {
  this.board.addPiece(coordinates[0], coordinates[1], this.currentPlayer.color)
  this.switchPlayer();
}

Game.prototype.currentPlayerMoves = function() {
  return this.board.validMoves(this.currentPlayer.color)
}

Game.prototype.isOver = function() {
  return this.board.isGameOver();
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
