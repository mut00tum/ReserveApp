var m = require( 'mithril' );

module.exports = function Check() {
  m.startComputation();
  var
    Map = {
      hour   : $( '#cardHour' ),
      member : $( '#cardMember' ),
      person : $( '#cardPerson' ),
      up     : $( '#card' ).find( '.up' ),
      down   : $( '#card' ).find( '.down' ),
      send   : $( '#submit' ).find('.send'),
      still  : $( '#submit' ).find('.still'),
      place  : $( '#timesList' ).find( '.place' )
    },
    timeList = [
      '0800','0830','0900','0930','1000','1030','1100','1130','1200','1230',
      '1300','1330','1400','1430','1500','1530','1600','1630','1700','1730',
      '1800','1830','1900','1930','2000','2030'
    ],
    hourStill     = 0,
    memberStill   = 0,
    personStill   = '',
    Overlap       = false,
    Class         = 'active',
    preList       = [],
    Id            = '',
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
    };

    if( !Check.hour && !Check.member && !Check.person) {
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
    // console.log( 'Send!!' )
    Map.still.css( { display: 'none' } );
    Map.send.css( { display: 'inline-block' } );
  }

  function showStill() {
    // console.log( 'Still!!' )
    Map.send.css( { display: 'none' } );
    Map.still.css( { display: 'inline-block' } );
  }

  function getPlaceId( self ) {
    Id = self.prop( 'id' );
  }
  function pushHourVal() {
    return Map.hour.val()
  }

  m.endComputation();
}