module.exports = function Spinner() {
  var
    card = $( '#card' ),
    hourField   = card.find('.hour'),
    memberField = card.find('.member'),
    $Map = {
      spinner : card.find( '.spinner' ),
      up      : card.find( '.up' ),
      down    : card.find( '.down' ),
      place   : $( '#timesList' ).find( '.place' )
    },
    Hour = {
      up    : hourField.find( '.up' ),
      down  : hourField.find( '.down' ),
      val   : 0,
      num   : 0
    },
    Member = {
      up   : memberField.find( '.up' ),
      down : memberField.find( '.down' )
    },
    parent , val;

    // Val.map( function( ) )
    // $Map.place.on( 'click' , function(){
    //   Field.hour.val( '0' );
    // });

    Hour.up.on( 'click' , function(){

      parent = $(this).parent();
      filed  = parent.find('input');

      Hour.val = String( Hour.num + 0.5 );
      Hour.num = Hour.num + 0.5;
      
      filed.val( Hour.val );

    });


    // $Map.down.on( 'click' , function(){
    //   parent = $(this).parent();
    //   filed  = parent.find('input');

    //   val = String( num - 0.5 );
    //   filed.val( val );
    //   num = num - 0.5;
    // });

}