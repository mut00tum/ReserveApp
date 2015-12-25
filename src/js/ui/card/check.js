module.exports = function Check() {
  var
    $Map = {
      place  : $( '#cardPlace' ).text(),
      date   : $( '#cardDate' ).text(),
      time   : $( '#cardTime' ).text(),
      hour   : $( '#cardHour' ).val(),
      member : $( '#cardMember' ).val(),
      person : $( '#cardPerson' ).val()
    }

    console.log($Map.hour)

    // if( $Map.hour )

}