module.exports = function Spinner() {
  var
    card = $( '#card' ),
    hourField   = card.find('.hour'),
    memberField = card.find('.member'),
    $Map = {
      spinner : card.find( '.spinner' ),
      place   : $( '#timesList' ).find( '.place' )
    },
    Hour = {
      filed  : hourField.find( 'input' ),
      up     : hourField.find( '.up' ),
      down   : hourField.find( '.down' ),
      setVal : 0,
      num    : 0,
      max    : 8,
      min    : 0.5
    },
    Member = {
      filed  : memberField.find( 'input' ),
      up     : memberField.find( '.up' ),
      down   : memberField.find( '.down' ),
      setVal : 0,
      num    : 0,
      max    : 8,
      min    : 1
    },
    parent;
  
    Hour.num      = 0;
    Member.num    = 0;
    // console.log( 'spinner' );

    $Map.place.on( 'click' , function(){
      Hour.num     = 0;
      Member.num   = 0;
    });

    Hour.filed.change(function(){
      Hour.num = Number( Hour.filed.val() );
      if( Hour.filed.val() > Hour.max ) {
        Hour.filed.val( Hour.max );
        Hour.num = Hour.max - 0.5;
      }
      if( Hour.filed.val() <= Hour.min ) {
        Hour.filed.val( Hour.min );
        Hour.num = Hour.min + 0.5;
      }
    })

    Hour.up.on( 'click' , function(){

      if( Hour.filed.val() >= Hour.max ) {
        Hour.num = Hour.max - 0.5;
      }
      Hour.setVal = String( Hour.num + 0.5 );
      Hour.num = Hour.num + 0.5;
      Hour.filed.val( Hour.setVal );

    });

    Hour.down.on( 'click' , function(){
      if( Hour.filed.val() <= Hour.min ) {
        Hour.num = Hour.min + 0.5;
      }
      Hour.setVal = String( Hour.num - 0.5 );
      Hour.num = Hour.num - 0.5;      
      Hour.filed.val( Hour.setVal );

    });


    function maximum( max , sum ) {
      return max - sum;
    }




}