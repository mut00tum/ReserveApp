require( 'TweenMax' );
require( 'TimelineMax' );
var m = require( 'mithril' );

module.exports = function ShowEffect() {
  var
    Card = {
      place : $( '#cardPlace' ),
      date  : $( '#cardDate' ),
      time  : $( '#cardTime' )
    },
    place = $( '#timesList' ).find( '.place' ),
    arr   = [];

  arr = [ Card.place , Card.date , Card.time ]

  place.on( 'click' , function(){

    TweenMax.set( arr , {
      bottom : -10,
      opacity : 0
    });

    TweenMax.staggerTo( arr , .2 , {
      bottom : 0,
      opacity : 1,
      delay: .3,
      ease : Power4.easeOut
    } , .075 );

  });

}