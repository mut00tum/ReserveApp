//times / index
var attachCurrent = require( './attachCurrent' );
var reserveInfo   = require( './reserveInfo' );
var fixedHeader   = require( './fixedHeader' );

module.exports = function Index() {
  attachCurrent();
  reserveInfo();
  fixedHeader();
}