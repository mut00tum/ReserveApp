module.exports = function ReserveInfo() {
  var
    $Map = {
      reserved : $( '#timesList' ).find( '.reserved' )
    };

  $Map.reserved.on( 'mouseover' , function(){

    // console.log( getTimestamp( $(this) ) )

  });
  
  function getTimestamp( t ) {
    return t.data( 'stamp' );
  }   

}