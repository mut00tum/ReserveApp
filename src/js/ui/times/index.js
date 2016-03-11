var attachCurrent = require( './attachCurrent' );
var timeBar       = require( './timeBar' );

module.exports = function Index() {
  attachCurrent();
  timeBar();
}