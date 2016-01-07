module.exports = function Check() {
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
    hourStill   = 0,
    memberStill = 0,
    personStill = '',
    Class       = 'active';

  Map.place.on( 'click' , function(){
    showStill();
  })

  Map.up.on( 'click' , function(){
    judge();
  });

  Map.down.on( 'click' , function(){
    judge();
  });

  Map.hour.change(function() {
    judge();
  });

  Map.member.change(function() {
    judge();
  });

  Map.person.change(function() {
    judge();
  });

  Map.person.keyup(function() {
    judge();
  });

  function judge() {
    var
      Check = {
      hour   : Map.hour.val()   == hourStill,
      member : Map.member.val() == memberStill,
      person : Map.person.val() == personStill
    };

    if( !Check.hour && !Check.member && !Check.person ) {
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

  function showSend() {
    Map.still.css( { display: 'none' } );
    Map.send.css( { display: 'inline-block' } );
  }

  function showStill() {
    Map.send.css( { display: 'none' } );
    Map.still.css( { display: 'inline-block' } );
  }

}