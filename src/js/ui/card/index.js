var slideCard  = require( './slideCard' );
var check      = require( './check' );
var sppinner   = require( './spinner' );
var showEffect = require( './showEffect' );
var searchSame = require( './searhSame' );

module.exports = function Index() {
  slideCard();
  check();
  sppinner();
  showEffect();
  searchSame();
}