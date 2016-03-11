require( 'TweenMax' );
require( 'TimelineMax' );

module.exports = function Spinner() {
  var
    card        = $( '#card' ),
    memberField = card.find('.member'),
    Map = {
      time    : $( '#cardTime' ),
      spinner : card.find( '.spinner' ),
      place   : $( '#timesList' ).find( '.place' )
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

    setSpinner( Member.filed , Member.up , Member.down , Member.setVal , Member.num , Member.max , Member.min , Member.sum , 'member');

    function setSpinner( filed , upBtn , downBtn , setVal , num , max , min , sum , sort ) {

      Map.place.on( 'click' , function(){
        num = 0;
      });

      filed.change(function(){
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
        num = Number( filed.val() );

        if( filed.val() == max ){
          maxEffect( filed );
        }
        if( filed.val() >= max ) {
          num = max - sum;
        }
        setVal = String( num + sum );
        filed.val( setVal );

      });

      downBtn.on( 'click' , function(){
        num = Number( filed.val() );

        if( filed.val() < min ) {
          num = min;
        }
        setVal = String( num - sum );
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
        });
    }

    function setHourLimit( ) {
      var
        limitMap = {
          '13:00':8, '13:30':7.5, '14:00':7, '14:30':6.5, '15:00':6, '15:30':5.5,
          '16:00':5, '16:30':4.5, '17:00':4, '17:30':3.5, '18:00':3, '18:30':2.5,
          '19:00':2, '19:30':1.5, '20:00':1, '20:30':0.5
        },
        timeText = Map.time.text(),
        max = 8;

      if( limitMap[timeText] ){
        max = limitMap[timeText]
      }

      return max;
    }
}