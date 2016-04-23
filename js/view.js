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
  this.highlight();
  this.$el.append($ul)
}

View.prototype.highlight = function() {
  var $li = $("li")
  var currentValidMoves = this.game.currentPlayerMoves();

  for (var i = 0; i < $li.length; i++) {
    for (var j = 0; j < currentValidMoves.length; j++) {
      var liRow = $li[i].date("pos")[0];
      var liCol = $li[i].date("pos")[1];
      var validRow = currentValidMoves[j][0];
      var validCol = currentValidMoves[j][1];

      if (liRow === validRow && liCol === validCol) {
        $li[i].addClass("highlight")
      }
    }
  }
}

View.prototype.makeMove = function() {

}

View.prototype.bindEvents = function() {
  this.$el.on("click", "li", function(event) {
    event.preventDefault();
    var $square = $(event.currentTarget);
    this.makeMove($square)
  }).bind(this)
}

module.exports = View;
