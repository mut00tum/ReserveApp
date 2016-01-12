require( 'TweenMax' );
require( 'TimelineMax' );
var m = require( 'mithril' );

module.exports = function Confirm() {
  m.startComputation();
  var
    Map = {
      hour     : $( '#cardHour' ),
      member   : $( '#cardMember' ),
      person   : $( '#cardPerson' ),
      sppinner : $( '#card' ).find( '.sppinner' ),
      unit     : $( '#card' ).find( '.unit' ),
      info     : $( '#card' ).find( '.info' ),
      send     : $( '#submit' ).find('.send'),
      still    : $( '#submit' ).find('.still'),
      place    : $( '#timesList' ).find( '.place' )
    },
    inputList = [ Map.hour , Map.member , Map.sppinner , Map.person , Map.unit ],
    infoList  = [ Map.info ],
    Class     = 'reserved';

  Map.place.on( 'click' , function( ){
    var self = $( this );

    set().hide( infoList );
    set().show( inputList );  
    
    if( self.hasClass( Class ) ) {
      set().hide( inputList );
      set().show( infoList );
    } 
    
  });

  function set() {

    function show( list ) {
      TweenMax.set( list , {
        display : 'block'
      });
    }

    function hide( list ) {
      TweenMax.set( list , {
        display : 'none'
      });
    }

    return {
      show : show,
      hide : hide
    }    
  }
  m.endComputation();
}