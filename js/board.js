var Piece = require('./piece.js')
var moveError = require('./moveError.js')

var Board = function() {
  this.grid = [];
  this.row = 10;
  this.col = 10;
  for (var i = 0; i < this.row; i ++) {
    var arr = []
    for (var j = 0; j < this.col; j++) {
      arr.push(new Piece(null))
    }
    this.grid.push(arr)
  }

  this.blackScore = 2;
  this.whiteScore = 2;
}

Board.prototype.addPiece = function(row, col, color) {
  if (this.isLegalMove([row, col], color)) {
    this.convertPiece([row, col], color)
  } else {
    throw new moveError("not valid")
  }
}

Board.prototype.convertPiece = function(coordinates, color) {
  this.grid[coordinates[0]][coordinates[1]].color = color;
  this.incrementCount(color)

  var movements = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];

  for (var i = 0; i < movements.length; i++) {
    this.flipPieces(coordinates, color, movements[i])
  }
}






Board.prototype.isLegalMove = function(coordinates, color) {
  var movements = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];

  for (var i = 0; i < movements.length; i++) {
    if (this.findMove(coordinates, color, movements[i])) {
      return true;
    }
  }
  return false;
}


Board.prototype.containsValidMove = function(color) {
  for (var i = 0; i < this.row; i++) {
    for (var j = 0; j < this.col; j++) {
      if (this.isLegalMove([i, j], color)) {
        return true;
      }
    }
  }
  return false;
}

Board.prototype.isGameOver = function() {
  return !this.containsValidMove("white") && !this.containsValidMove("black")
}

Board.prototype.validMoves = function(color) {
  var moves = [];
  for (var i = 0; i < this.row; i++) {
    for (var j = 0; j < this.col; j++) {
      if (this.isLegalMove([i, j], color)) {
        moves.push([i, j])
      }
    }
  }
  return moves;
}



Board.prototype.findMove = function(coordinates, color, dir) {
  if (this.findPiece(coordinates).color !== null) {
    return false;
  }

  var count = 0;
  var newCoords = Board.directions(coordinates, dir);

  while (Board.inBounds(newCoords) && this.findPiece(newCoords).color === Board.oppositeColor(color)) {
    count++;
    newCoords = Board.directions(newCoords, dir)
  }

  return (count > 0 && Board.inBounds(newCoords) && this.findPiece(newCoords).color === color);
}


Board.oppositeColor = function(color) {
  if (color === "white") {
    return "black";
  } else if (color === "black") {
    return "white";
  }
}


Board.directions = function(coordinates, dir) {
  var row = coordinates[0] + dir[0];
  var col = coordinates[1] + dir[1];
  return [row, col]
}

Board.inBounds = function(coordinates) {
  if (coordinates[0] < 0 || coordinates[0] > 9) {
    return false;
  }

  if (coordinates[1] < 0 || coordinates[1] > 9) {
    return false;
  }

  return true;
}

Board.prototype.incrementCount = function(color) {
  if (color === "black") {
    this.blackScore++;
  } else {
    this.whiteScore++;
  }
}

Board.prototype.tradeCount = function(color, count) {
  if (color === "black") {
    this.blackScore += count;
    this.whiteScore -= count
  } else if (color === "white") {
    this.whiteScore += count;
    this.blackScore -= count;
  }
}

Board.prototype.setupBoard = function() {
  this.grid[4][4].color = "white";
  this.grid[5][5].color = "white";
  this.grid[4][5].color = "black";
  this.grid[5][4].color = "black";
}

Board.prototype.flipPieces = function(coordinates, color, dir) {
  var dirCoords = [];
  var newCoords = Board.directions(coordinates, dir);

  while (Board.inBounds(newCoords) && this.findPiece(newCoords).color === Board.oppositeColor(color)) {
    dirCoords.push(newCoords);
    newCoords = Board.directions(newCoords, dir)
  }

  if (Board.inBounds(newCoords) && this.findPiece(newCoords).color === color) {
    this.tradeCount(color, dirCoords.length)
    for (var i = 0; i < dirCoords.length; i++) {
      this.findPiece(dirCoords[i]).color = color;
    }
  }
}

Board.prototype.findPiece = function(coordinates) {
  return this.grid[coordinates[0]][coordinates[1]];
}

module.exports = Board;
