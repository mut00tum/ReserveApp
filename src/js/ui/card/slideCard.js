require( 'TweenMax' );
require( 'TimelineMax' );
var m = require( 'mithril' );

module.exports = function SlideCard() {
  // m.startComputation();
  var
    $Map = {
      card     : $( '#card' ),
      submit   : $( '#submit' ).find( '.send' ),
      cancel   : $( '#cancel' ),
      closeBtn : $( '#closeBtn' ),
      place    : $( '#timesList' ).find( '.place' )
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
      OPEN  : .05,
      CLOSE : .05
    },
    EASE = {
      OPEN  : Power2.easeOut,
      CLOSE : Power2.easeIn,
      SUBMIT: Back.easeIn.config(1.7)
    },
    Class = 'current';

  $Map.place.on( 'click' , function(){
    open();
    // setTimeout( function(){
    //   open();
    // } , DELAY.OPEN );
  });

  $Map.submit.on( 'click' , function(){
    close();
    // setTimeout( function(){
    //   close( SPEED.CLOSE , EASE.SUBMIT );
    // } , DELAY.CLOSE );
  });

  $Map.cancel.on( 'click' , function(){
    cancelClose( SPEED.BTN , EASE.CLOSE );
  });

  $Map.closeBtn.on( 'click' , function(){
    close( SPEED.BTN , EASE.CLOSE );
  });

  function open() {
    var tween = TweenMax.to( $Map.card , SPEED.OPEN ,{
      right : - Size_Map.padding,
      ease  : EASE.OPEN,
      delay : DELAY.OPEN,
      onComplete: function(){
        this.pause( this.totalDuration() );
      }
    });

    // tween.pause(tween.totalDuration())
    // tween.kill();
  }

  function close ( speed , ease ) {
    var tween = TweenMax.to( $Map.card , speed ,{
      right : - Size_Map.card - Size_Map.padding,
      ease  : ease,
      delay : DELAY.CLOSE,
      onComplete: function(){
        this.pause( this.totalDuration() );
      }
    });
  }

  function cancelClose ( speed , ease ) {
    // setOpen();
    var tween = TweenMax.to( $Map.card , speed ,{
      right : - Size_Map.card - Size_Map.padding,
      ease  : ease,
      delay : .4,
      onComplete: function(){
        this.pause( this.totalDuration() );
      }
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
  // m.endComputation();
}