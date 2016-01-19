var check        = require( './check' );
var sppinner     = require( './spinner' );
var eventManager = require( './eventManager' );

module.exports = function Index() {
  check();
  sppinner();
  eventManager();
}