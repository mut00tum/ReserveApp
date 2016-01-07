var slideCard = require( './slideCard' );
var check     = require( './check' );
var sppinner  = require( './spinner' );
var showEffect = require( './showEffect' );

module.exports = function Index() {
  slideCard();
  check();
  sppinner();
  showEffect();
}