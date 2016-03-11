module.exports = function AttachCurrent() {
  var
    Map = {
      place : $( '#timesList' ).find( '.place' )
    },
    Class = 'current';

  Map.place.on( 'click' , function(){
    Map.place.removeClass( Class );
    $(this).addClass( Class );
  })

}