// var changeWeek = require( './changeWeek' );

module.exports = function ResizeWindow( func ) {
  var
    timer = false,
    w     = window,
    width;

  window.onresize = function(){
    if( timer ) {
      clearTimeout(timer);
    }
    timer = setTimeout( function() {
      func();
    }, 200 );
  }

}


