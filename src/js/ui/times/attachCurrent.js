module.exports = function AttachCurrent() {
  var
    $Map = {
      place : $( '#uiTimesList' ).find( '.place' )
    },
    Class = 'current';

  $Map.place.on( 'click' , function(){
    $Map.place.removeClass( Class );
    $(this).addClass( Class );
  })

}