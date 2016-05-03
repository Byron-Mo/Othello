/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var Game = __webpack_require__(1)
	var View = __webpack_require__(6)
	
	$(function() {
	  var $el = $("figure");
	  var game = new Game();
	  new View(game, $el)
	})


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Board = __webpack_require__(2);
	var Player = __webpack_require__(5);
	
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


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Piece = __webpack_require__(3)
	var moveError = __webpack_require__(4)
	
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


/***/ },
/* 3 */
/***/ function(module, exports) {

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


/***/ },
/* 4 */
/***/ function(module, exports) {

	function moveError(msg) {
	  this.msg = msg;
	}
	
	module.exports = moveError;


/***/ },
/* 5 */
/***/ function(module, exports) {

	var Player = function(game, color) {
	  this.color = color;
	}
	
	Player.prototype.addPiece = function(row, col) {
	  game.board.addPiece(row, col, this.color)
	}
	
	module.exports = Player;


/***/ },
/* 6 */
/***/ function(module, exports) {

	var View = function(game, $el) {
	  this.game = game;
	  this.$el = $el;
	
	  this.game.setup();
	  this.setupBoard();
	  this.bindEvents();
	}
	
	View.prototype.setupBoard = function() {
	  var $ul = $("<ul></ul>")
	  for (var i = 0; i < 10; i++) {
	    for (var j = 0; j < 10; j++) {
	      var $li = $("<li></li>")
	      $li.data("pos", [i, j])
	      $li.data("color", this.game.board.grid[i][j].color)
	      $li.addClass(this.game.board.grid[i][j].color)
	      $ul.append($li)
	    }
	  }
	  this.$el.append($ul)
	  this.highlight();
	  this.updateScore();
	}
	
	View.prototype.highlight = function() {
	  var $li = $("li")
	  var currentValidMoves = this.game.currentPlayerMoves();
	
	  for (var i = 0; i < $li.length; i++) {
	    for (var j = 0; j < currentValidMoves.length; j++) {
	      var liRow = $($li[i]).data("pos")[0];
	      var liCol = $($li[i]).data("pos")[1];
	      var validRow = currentValidMoves[j][0];
	      var validCol = currentValidMoves[j][1];
	
	      if (liRow === validRow && liCol === validCol) {
	        $($li[i]).addClass("highlight")
	      }
	    }
	  }
	}
	
	View.prototype.makeMove = function($square) {
	  // check and make sure square is correct
	  var pos = $square.data("pos");
	
	  try {
	    this.game.playMove(pos)
	    this.updateScore()
	  } catch (e) {
	    return;
	  }
	
	  this.updateBoard();
	  this.highlight();
	  console.log(this.game.winner)
	  if (this.game.isOver()) {
	    this.$el.off("click");
	    $status = $(".status");
	    if (this.game.winner === "Tie") {
	      $status.text("It's a tie!")
	    } else {
	      $status.text(this.game.winner + " wins!")
	    }
	  }
	}
	
	View.prototype.updateScore = function() {
	  var $whiteScore = $("div.white-score");
	  var $blackScore = $("div.black-score");
	  var $status = $(".status");
	
	  $status.text("Current Player is: " + this.game.currentPlayer.color)
	  $whiteScore.text("White: " + this.game.board.whiteScore)
	  $blackScore.text("Black: " + this.game.board.blackScore)
	}
	
	View.prototype.updateBoard = function() {
	  var $li = $("li");
	  $li.removeClass();
	
	  for (var i = 0; i < $li.length; i++) {
	    var $item = $($li[i]);
	    var row = $item.data("pos")[0]
	    var col = $item.data("pos")[1]
	
	    $item.addClass(this.game.board.grid[row][col].color)
	  }
	}
	
	View.prototype.bindEvents = function() {
	  var that = this;
	  this.$el.on("click", "li", function(event) {
	    event.preventDefault();
	    var $square = $(event.currentTarget);
	    that.makeMove($square)
	  })
	}
	
	module.exports = View;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map