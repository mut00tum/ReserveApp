var m        = require( 'mithril' );
var timeArea = require( '../../data/timeArea' );

module.exports = function Check() {
  // m.startComputation();
  var
    Map = {
      hour   : $( '#cardHour' ),
      member : $( '#cardMember' ),
      person : $( '#cardPerson' ),
      up     : $( '#card' ).find( '.up' ),
      down   : $( '#card' ).find( '.down' ),
      send   : $( '#submit' ).find('.send'),
      still  : $( '#submit' ).find('.still'),
      place  : $( '#timesList' ).find( '.place' ),
      notice : $( '#hourNotice' )
    },
    TextMap = {
      notice : '予約が入っています'
    },
    timeList = timeArea(),
    hourStill     = 0,
    memberStill   = 0,
    personStill   = '',
    Overlap       = false,
    Class         = 'active',
    preList       = [],
    Id            = "",
    matchOrder , length;


  Map.place.on( 'click' , function( ){
    getPlaceId( $(this) );
    showStill();
  });

  Map.up.on( 'click' , function(){
    judge( Id );
  });

  Map.down.on( 'click' , function(){
    judge( Id );
  });

  Map.hour.change(function() {
    judge( Id );
  });

  Map.hour.keyup(function() {
  });

  Map.member.change(function() {
    judge( Id );
  });

  Map.person.change(function() {
    judge( Id );
  });

  Map.person.keyup(function() {
    judge( Id );
  });

  function judge( Id ) {
    var
      Check = {
        hour    : Map.hour.val()   == hourStill,
        member  : Map.member.val() == memberStill,
        person  : Map.person.val() == personStill
      },
      hour   = Math.round(Map.hour.val() * 10 ) / 10;
      member = Math.floor(Map.member.val());

    if ( !(hour % 0.5) == 0) {
      var setNum = String(hour).substr( 0,2 );
      var num    = String(hour).substr( 2,1 );
      if ( num < 5  ) { num = 0; }
      if ( num > 5  ) { num = 5; }
      hour = Number( setNum + num );
    };

    Map.hour.val( hour );
    Map.member.val( member );

    if( !Check.hour ) {
      if( Id ) {
        var
          IdArr   = Id.split( '_' ),
          day     = IdArr[0] + '_' + IdArr[1] + '_' + IdArr[2],
          time    = IdArr[3],
          place   = IdArr[4],
          hour    = Map.hour.val();

        // init
        preList  = [];

        matchOrder = timeList.indexOf( time );
        length = ( matchOrder ) + hour * 2;
        for( var i = matchOrder + 1; i < length; i++ ) {
          preList.push( day + '_' + timeList[i] + '_' + place )
        }
        if( !preList == [] ){
          var length = preList.length
          var i = 0;
          while ( i < length ) {
            var id = '#' + preList[i];
            if ( $( id ).hasClass('reserved') ) {
              showStill();
              return false;
            }
            i++
          }
        }
        showSend();
      }
    }

    if( Check.hour ) {
      showStill();
    }
    if( Check.member ) {
      showStill();
    }
    if( Check.person ) {
      showStill();
    }

  }

  function showSend() {
    Map.still.css( { display: 'none' } );
    Map.send.css( { display: 'inline-block' } );
  }

  function showStill() {
    Map.send.css( { display: 'none' } );
    Map.still.css( { display: 'inline-block' } );
  }

  function getPlaceId( self ) {
    Id = self.prop( 'id' );
  }
  function pushHourVal() {
    return Map.hour.val()
  }

  // function setNotice() {
  //   function show() {
  //     Map.notice.text( TextMap.notice );
  //   }
  //   function hide() {
  //     Map.notice.text('');
  //   }
  //   return {
  //     show : show,
  //     hide : hide
  //   }
  // }

  // m.endComputation();
}