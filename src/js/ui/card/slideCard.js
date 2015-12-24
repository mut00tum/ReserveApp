require( 'TweenMax' );
require( 'TimelineMax' );
// var m = require( 'mithril' );

module.exports = function SlideCard() {
  var
    $Map = {
      card   : $( '#card' ),
      submit : $( '#submit' ),
      cancel : $( '#cancel' ),
      closeBtn : $( '#closeBtn' ),
      place  : $( '#uiTimesList' ).find( '.place' )
    },
    Size_Map = {
      card    : $( '#card' ).width(),
      padding : parseInt($('#card').css('padding-right'), 10)
    },
    SPEED = {
      OPEN  : .3,
      CLOSE : .5,
      BTN   : .3
    },
    DELAY = {
      OPEN  : 100,
      CLOSE : 100
    },
    EASE = {
      OPEN  : Power2.easeOut,
      CLOSE : Power2.easeIn,
      SUBMIT: Back.easeIn.config(1.7)
    },
    Class = 'current';

  $Map.place.on( 'click' , function(){
    setTimeout( function(){
      open();
    } , DELAY.OPEN );
  });

  $Map.submit.on( 'click' , function(){
    setTimeout( function(){
      close( SPEED.CLOSE , EASE.SUBMIT );
    } , DELAY.CLOSE );
  });

  $Map.cancel.on( 'click' , function(){
    close( SPEED.BTN , EASE.CLOSE );
  });

  $Map.closeBtn.on( 'click' , function(){
    close( SPEED.BTN , EASE.CLOSE );
  });

  function open() {
    TweenMax.to( $Map.card , SPEED.OPEN ,{
      right : - Size_Map.padding,
      ease  : EASE.OPEN
    });
  }

  function close ( speed , ease ) {
    // setOpen();
    TweenMax.to( $Map.card , speed ,{
      right : - Size_Map.card - Size_Map.padding,
      ease  : ease
    });
  }

  function setOpen() {
    TweenMax.set( $Map.card , {
      right : 0
    });
  }

  function removeCurrent() {
    $Map.place.removeClass( Class );
  }

}