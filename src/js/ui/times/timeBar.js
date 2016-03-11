// require( 'TweenMax' );
// require( 'TimelineMax' );
var timeArea = require( '../../data/timeArea' );

module.exports = function TimeBar() {
  var
    timesList = $( '#timesList' ),
    Map = {
      place    : timesList.find( '.place' ),
      cancel   : $( '#cancel' ),
      submit   : $( '#submit' ).find( '.send' )
    },
    Class = 'timebar',
    Select = 'select',
    state = false;

    Map.place.on({
      mouseover: function(){
        var self = $( this );
        if( !state ){
          $( getMatch(self) ).addClass( Class );
        }
      },
      mouseleave: function(){
        var self = $( this );
        if( !state ){
          $( getMatch(self) ).removeClass( function(){return Class} );
        }
      }
      // click: function(){
      //   var self = $( this );
      //   Map.place.removeClass( function(){return Select} );
      //   $( getMatch(self) ).addClass( Select );
      //   // state = true;
      // }
    });

    Map.cancel.on( 'click' , function(){
      Map.place.removeClass( function(){return Select} );
    });

    Map.submit.on( 'click' , function(){
      Map.place.removeClass( function(){return Select} );
    });

    function getMatch( self ){
      return match = '[data-time="' + self.data( 'time' ) + '"]';
    }

}