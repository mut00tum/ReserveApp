require( 'TweenMax' );
require( 'TimelineMax' );

module.exports = function ChangeWeek() {
  var
    $Map = {
      card  : $( '#reserveCard' ),
      btn   : $( '#submit' ),
      place : $( '#uiTimesList' ).find( '.place' )
    },
    Size_Map = {
      card : $( '#reserveCard' ).width()
    },
    SPEED_MAP = {
      OPEN  : .2,
      CLOSE : .5
    },
    Class = 'current';

  TweenMax.set( $Map.card , {
    right : - Size_Map.card,
    display : 'block'
  });

  $Map.place.on( 'click' , function(){
    open();
  });

  $Map.btn.on( 'click' , function(){
    close();
    // removeCurrent();
  });

  function open() {
    TweenMax.to( $Map.card , SPEED_MAP.OPEN ,{
      right : 0
    });
  }

  function close () {
    TweenMax.to( $Map.card , SPEED_MAP.CLOSE ,{
      right : - Size_Map.card
    });
  }

  function removeCurrent() {
    $Map.place.removeClass( Class );
  }

}