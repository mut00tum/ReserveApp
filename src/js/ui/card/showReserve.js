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

    setInfo().hide();
    setInput().show();  
    
    if( self.hasClass( Class ) ) {
      setInput().hide();
      setInfo().show();
    } 
    
  });

  function setInput() {

    function show() {
      // console.log( 'show:' + list )
      TweenMax.set( inputList , {
        display : 'block'
      });
    }

    function hide() {
      // console.log( 'hide:' + inputList )
      TweenMax.set( inputList , {
        display : 'none'
      });
    }

    return {
      show : show,
      hide : hide
    }    
  }

  function setInfo() {

    function show() {
      // console.log( 'show:' + list )
      TweenMax.set( infoList , {
        display : 'block'
      });
    }

    function hide() {
      // console.log( 'hide:' + list )
      TweenMax.set( infoList , {
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