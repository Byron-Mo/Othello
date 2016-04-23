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
}

View.prototype.highlight = function() {
  var $li = $("li")
  var currentValidMoves = this.game.currentPlayerMoves();
  // console.log(currentValidMoves)

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
  } catch (e) {
    return;
  }

  this.updateBoard();
  this.highlight();
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
