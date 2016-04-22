var Piece = require('./piece.js')

var Board = function() {
  this.grid = [];
  for (var i = 0; i < 10; i ++) {
    var arr = []
    for (var j = 0; j < 10; j++) {
      arr.push(new Piece(null))
    }
    this.grid.push(arr)
  }
}

Board.prototype.addPiece = function(row, col, color) {
  if (this.isLegalMove([row, col], color)) {
    this.convertPiece([row, col], color)
  } else {
    console.log("can't do this")
  }
}

Board.prototype.convertPiece = function(coordinates, color) {
  this.grid[coordinates[0]][coordinates[1]].color = color;

  this.flipPieces(coordinates, color, "down")
  this.flipPieces(coordinates, color, "up");
  this.flipPieces(coordinates, color, "left")
  this.flipPieces(coordinates, color, "right")
}

Board.prototype.flipPieces = function(coordinates, color, dir) {
  var dirCoords = [];
  var newCoords = Board.directions(coordinates, dir);

  while (Board.inBounds(newCoords) && this.findPiece(newCoords).color === Board.oppositeColor(color)) {
    dirCoords.push(newCoords);
    newCoords = Board.directions(newCoords, dir)
  }

  if (Board.inBounds(newCoords) && this.findPiece(newCoords).color === color) {
    for (var i = 0; i < dirCoords; i++) {
      this.findPiece(dirCoords[i]).color = color;
    }
  }
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
}

Board.prototype.findPiece = function(coordinates) {
  return this.grid[coordinates[0]][coordinates[1]];
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


Board.inBounds = function(coordinates) {
  if (coordinates[0] < 0 || coordinates[0] > 9) {
    return false;
  }

  if (coordinates[1] < 0 || coordinates[1] > 9) {
    return false;
  }

  return true;
}
