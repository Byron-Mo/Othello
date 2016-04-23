var Piece = require('./piece.js')
var moveError = require('./moveError.js')

var Board = function() {
  this.grid = [];
  for (var i = 0; i < 10; i ++) {
    var arr = []
    for (var j = 0; j < 10; j++) {
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

  this.flipPieces(coordinates, color, "down")
  this.flipPieces(coordinates, color, "up");
  this.flipPieces(coordinates, color, "left")
  this.flipPieces(coordinates, color, "right")
}



Board.prototype.findMove = function(coordinates, color, dir) {
  var count = 0;
  var newCoords = Board.directions(coordinates, dir);

  while (Board.inBounds(newCoords) && this.findPiece(newCoords).color === Board.oppositeColor(color)) {
    count++;
    newCoords = Board.directions(newCoords, dir)
  }

  return (count > 0 && Board.inBounds(newCoords) && this.findPiece(newCoords).color === color);
}





Board.prototype.isLegalMove = function(coordinates, color) {
  return (
    this.findMove(coordinates, color, "up") ||
    this.findMove(coordinates, color, "down") ||
    this.findMove(coordinates, color, "left") ||
    this.findMove(coordinates, color, "right")
  )
}

Board.oppositeColor = function(color) {
  if (color === "white") {
    return "black";
  } else if (color === "black") {
    return "white";
  }
}

Board.prototype.containsValidMove = function(color) {
  for (var i = 0; i < 10; i++) {
    for (var j = 0; j < 10; j++) {
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
  for (var i = 0; i < 10; i++) {
    for (var j = 0; j < 10; j++) {
      if (this.isLegalMove([i, j], color)) {
        moves.push([i, j])
      }
    }
  }
  return moves;
}








Board.directions = function(coordinates, dir) {
  switch(dir) {
    case "left":
      return [coordinates[0], coordinates[1] - 1];
      break;
    case "right":
      return [coordinates[0], coordinates[1] + 1];
      break;
    case "up":
      return [coordinates[0] - 1, coordinates[1]];
      break;
    case "down":
      return [coordinates[0] + 1, coordinates[1]];
      break;
  }
  //
  // if (dir === "left") {
  //     return [coordinates[0], coordinates[1] - 1];
  // } else if (dir === "right") {
  //   return [coordinates[0], coordinates[1] + 1]
  // } else if (dir === "up") {
  //   return [coordinates[0] - 1, coordinates[1]];
  // } else if (dir === "down") {
  //   return [coordinates[0] + 1, coordinates[1]];
  // }
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
