module.exports = function SearchSame() {
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
    hourValList = {
      '0.5': 1, '1': 2, '1.5': 3, '2': 4, '2.5': 5, '3': 6, '3.5': 7, '4': 8, '4.5': 9,
      '5': 10, '5.5': 11, '6': 12, '6.5': 13, '7': 14, '7.5': 15, '8': 16
    },
    Class = 'active',
    hour , matchOrder , length;

  Map.place.on( 'click' , function(){
    var
      self     = $( this ),
      Class    = self.prop( 'id' ),
      preList  = [],
      classArr = Class.split( '_' ),
      day      = classArr[0] + '_' + classArr[1] + '_' + classArr[2],
      time     = classArr[3],
      place    = classArr[4];

    hour = 1;


    matchOrder  = timeList.indexOf( time );
    
    length = ( matchOrder + 1 ) + hourValList[hour];
    for( var i = matchOrder + 1; i < length; i++ ) {
      preList.push( day + '_' + timeList[i] + '_' + place )
    }

    // console.log( preList )
    $.each( preList , function( i , val ){
      // console.log( val  )
      var id = '#' + val;
      console.log( id  )
      if ( $( id ).hasClass('reserved') ) {
        console.log( 'reserved!' )
      }
    });
    
  })

  Map.up.on( 'click' , function(){
  });

  Map.down.on( 'click' , function(){
  });

  Map.send.on( 'click' , function(){
  });

  Map.hour.change(function() {
  });

  Map.member.change(function() {
  });

  Map.person.change(function() {
  });

  Map.person.keyup(function() {
  });

  

}