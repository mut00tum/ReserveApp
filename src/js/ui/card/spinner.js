require( 'TweenMax' );
require( 'TimelineMax' );
var m = require( 'mithril' );

module.exports = function Spinner() {
  m.startComputation();
  var
    card = $( '#card' ),
    hourField   = card.find('.hour'),
    memberField = card.find('.member'),
    $Map = {
      time    : $( '#cardTime' ),
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
      min    : 0.5,
      sum    : 0.5
    },
    Member = {
      filed  : memberField.find( 'input' ),
      up     : memberField.find( '.up' ),
      down   : memberField.find( '.down' ),
      setVal : 0,
      num    : 0,
      max    : 20,
      min    : 1,
      sum    : 1
    };

    setSpinner( Hour.filed , Hour.up , Hour.down , Hour.setVal , Hour.num , setHourLimit() , Hour.min , Hour.sum , 'hour' );
    setSpinner( Member.filed , Member.up , Member.down , Member.setVal , Member.num , Member.max , Member.min , Member.sum , 'member');

    function setSpinner( filed , upBtn , downBtn , setVal , num , max , min , sum , sort ) {
      
      $Map.place.on( 'click' , function(){
        num = 0;
        if( sort == 'hour' ) {
          max = setHourLimit();
        }
      });

      filed.change(function(){
        if( sort == 'hour' ) {
          max = setHourLimit();
        }
        num = Number( filed.val() );
        if( filed.val() == max ){
          maxEffect( filed );
        }
        if( filed.val() > max ) {
          filed.val( max );
          num = max - sum;
        }
        if( filed.val() <= min ) {
          filed.val( 0 );
          num = min;
        }

      });

      upBtn.on( 'click' , function(){
        if( sort == 'hour' ) {
          max = setHourLimit();
        }
        if( filed.val() == max ){
          maxEffect( filed );
        }
        if( filed.val() >= max ) {
          num = max - sum;
        }
        setVal = String( num + sum );
        num = num + sum;
        filed.val( setVal );
        
      });

      downBtn.on( 'click' , function(){
        if( sort == 'hour' ) {
          max = setHourLimit();
        }
        if( filed.val() < min ) {
          num = min;
        }
        setVal = String( num - sum );
        num = num - sum;      
        filed.val( setVal );
      });
    }

    function maxEffect( filed ) {
      var
        SPEED = {
          READY : .05,
          MAX : .3
        },
        EASE = {
          MAX : Elastic.easeOut.config(1, 0.2)
        },
        TL = new TimelineMax();

      TL.to( filed , SPEED.READY , { left : - 10 } )
        .to( filed , SPEED.MAX , { 
          left : 0,
          ease : EASE.MAX
          // delay : .1
          })
    }

    function setHourLimit( ) {
      var
        limitMap = {
          '13:00':7.5, '13:30':7, '14:00':6.5, '14:30':6, '15:00':5.5, '15:30':5,
          '16:00':4.5, '16:30':4, '17:00':3.5, '17:30':3, '18:00':2.5, '18:30':2,
          '19:00':1.5, '19:30':1, '2:000':0.5, '20:30':0
        },
        timeText = $Map.time.text(),
        max = 8;

      if( limitMap[timeText] ){
        max = limitMap[timeText]
      }

      return max;
    }
  m.endComputation();
}