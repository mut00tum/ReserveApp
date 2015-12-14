//times / index

var attachCurrent = require( './attachCurrent' );
var reserveInfo   = require( './reserveInfo' );

module.exports = function Index() {
  attachCurrent();
  reserveInfo();
}