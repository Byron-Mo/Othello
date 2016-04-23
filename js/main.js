var Game = require("./game.js")
var View = require("./view.js")

$(function() {
  var $el = $("figure");
  var game = new Game();
  new View(game, $el)
})
