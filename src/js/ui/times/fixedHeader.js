module.exports = function FixedHeader() {
  var
    $Map = {
      days   : $( '#days' ),
      header : $( '#days' ),
      times  : $( '#times' ),
      zone   : $( '#timeZone' )
    },
    VALUE = {
      SCROLL : 300,
      SPEED  : 300
    },
    top       = $Map.days.position().top,
    windowTop = $(window).scrollTop(),
    scroll;

    if( windowTop > top ) {
      addClass();
    }

    $(window).on( 'scroll' , function(){
      scroll = $(this).scrollTop();
      if( scroll > top ){
        addClass(); 
      } 
      if( scroll <= top ) {
        removeClass(); 
      }
    });

    function addClass() {
      $Map.header.addClass('fixed');
      $Map.times.addClass('fixed');
      $Map.zone.addClass('fixed');
    }

    function removeClass() {
      $Map.header.removeClass('fixed');
      $Map.times.removeClass('fixed');
      $Map.zone.removeClass('fixed');
    }

}