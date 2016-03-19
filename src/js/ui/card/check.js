var timeArea = require( '../../data/timeArea' );

module.exports = function Check() {
  var
    Dom = {
      hour : document.getElementById('cardHour')
    },
    Map = {
      hour       : $( '#cardHour' ),
      member     : $( '#cardMember' ),
      person     : $( '#cardPerson' ),
      up         : $( '#card' ).find( '.up' ),
      down       : $( '#card' ).find( '.down' ),
      send       : $( '#submit' ).find('.send'),
      still      : $( '#submit' ).find('.still'),
      place      : $( '#timesList' ).find( '.place' ),
      notice     : $( '#hourNotice' ),
      selectList : $( '#selectList' )
    },
    TextMap = {
      notice : '予約が入っています'
    },
    timeList = timeArea(),
    hourStill   = 0,
    memberStill = 0,
    personStill = '',
    Overlap     = false,
    Class       = 'active',
    preList     = [],
    Id          = "",
    matchOrder , length;

  Map.place.on( 'click' , function( ){
    removePreClass();
    getPlaceId( $(this) );
    setNotice().hide();
    showStill();
  });

  Map.up.on( 'click' , function(){
    judge( Id );
  });

  Map.down.on( 'click' , function(){
    judge( Id );
  });

  Map.hour.on( {
    'click' : function(){
      judge( Id );
    }
  });

  Map.selectList.on( {
    'click' : function(){
      judge( Id );
    }
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
        hour    : Dom.hour.getAttribute( 'data-cardhour' ) == hourStill,
        member  : Map.member.val() == memberStill,
        person  : Map.person.val() == personStill
      },
      member = Math.floor(Map.member.val());

    Map.member.val( member );


    if( Id ) {
      var
        IdArr = Id.split( '_' ),
        day   = IdArr[0] + '_' + IdArr[1] + '_' + IdArr[2],
        time  = IdArr[3],
        place = IdArr[4],
        hour  = Number( Dom.hour.getAttribute( 'data-cardhour' ) );

      // init
      preList  = [];

      matchOrder = timeList.indexOf( time );
      var length = matchOrder + hour;

      removePreClass();

      for( var i = matchOrder; i < length; i++ ) {
        preList.push( day + '_' + timeList[i] + '_' + place )
        var id = '#' + day + '_' + timeList[i] + '_' + place;
        $( id ).addClass( 'pre' );
      }

      function setPreCurrent( time ){
        var matchOrder = timeList.indexOf( time );
        var next = self.parent().find( timeList[ matchOrder + 1 ] );
      }
      // setPreCurrent( time );

      if( !preList == [] ){
        var length = preList.length
        var i      = 0;
        while ( i < length ) {
          var id = '#' + preList[i];
          if ( $( id ).hasClass('reserved') ) {
            showStill();
            setNotice().show();
            return false;
          }
          i++
        }
      }
      // setNotice().hide();
      showSend();
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

  function removePreClass() {
    if( $( '#timesList' ).find( '.pre' ) ){
        $( '#timesList' ).find( 'li' ).removeClass( function(){return 'pre'} )
      }
  }

  function showSend() {
    Map.still.css( { display: 'none' } );
    Map.send.css( { display: 'inline-block' } );
    setNotice().hide();
  }

  function showStill() {
    Map.send.css( { display: 'none' } );
    Map.still.css( { display: 'inline-block' } );
  }

  function getPlaceId( self ) {
    Id = self.prop( 'id' );
  }
  function pushHourVal() {
    return Map.hour.data( 'cardhour' )
  }
  function setNotice() {
    function show() {
      Map.notice.css( { display: 'inline-block' } );
    }
    function hide() {
      Map.notice.css( { display: 'none' } );
    }
    return {
      show : show,
      hide : hide
    }
  }

}