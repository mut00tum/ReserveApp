require( 'TweenMax' );
require( 'TimelineMax' );
var resize  = require( '../window/resize' );

module.exports = function ChangeWeek() {
  var
    $Map = {
      prev      : $( '#prev' ),
      next      : $( '#next' ),
      calendar  : $( '#calendar' ),
      times     : $( '#times' ),
      daysList  : $( '#days > ul' ),
      timesList : $( '#timesList' ),
    },
    Value = {
      count    : 0,
      position : 0,
      clnWidth : 0
    };  

  var 
    dates      = $Map.timesList.children(),
    dateLength = dates.length / 7,
    nowPosition , length

  // ▼ Mithril再描画用の処理
  if ( Math.abs(getClnPosition()) > 0 ) {
    Value.clnWidth = getMoveWidth();

    var nowPosition = getClnPosition()
    var length = $Map.timesList.find('.date').length / 7;

    for ( var i = 0; i < length; i++) {
      if ( Math.abs(nowPosition) == Value.clnWidth * i ) {
        Value.count = i;
        setClnState( nowPosition );
        setClnPosition();
      }
    }
  }

  resize( setClnPosition );

  $Map.next.on( 'click' , function(){
    
    Value.clnWidth = getMoveWidth();
    setGoValue();

    if( Math.abs(Value.position) == Value.clnWidth ) {
      setShow( $Map.prev );
    }
    if( Math.abs(Value.position) >= Value.clnWidth * ( dateLength - 1 ) ) {
      setHide( $Map.next );
    }
    getGoAnimation( Value.position );
   });
 
  $Map.prev.on( 'click' , function(){

    Value.clnWidth = getMoveWidth();

    if( Math.abs( Value.position ) == Value.clnWidth ) {
      setHide( $Map.prev );
    }
    if( Math.abs(Value.position) >= Value.clnWidth * ( dateLength - 2 ) ) {
      setShow( $Map.next );
    }
    setBackValue();
    getGoAnimation( Value.position );

  });

  function getClnPosition(){
   return parseInt( $( '#timesList' ).css('left') );
  }

  function setClnPosition() {
    var
      num   = Value.count,
      value = getMoveWidth();
    
    Value.position = - ( value * ( num ) );
    getRePotsitionAnimation( Value.position );

    return false;
  }

  function setHide( t ) {
    TweenMax.set( t , {
      display : 'none'
    });
  }

  function setShow( t ) {
    TweenMax.set( t , {
      display : 'block'
    });
  }

  function getMoveWidth() {
    var width = $Map.times.prop('clientWidth');
    return width;
  }

  function setClnState( w ) {
    TweenMax.set( [$Map.daysList, $Map.timesList] , {
      left    : w,
      opacity : 1,
    });
  }

  function getGoAnimation( w ) {
    var      
      SPEED_MAP = {
        HIDE : .15,
        MOVE : .5
      },
      TL = new TimelineMax();

   TL.to( [$Map.daysList, $Map.timesList] , SPEED_MAP.HIDE , {
        opacity : 0
      })
      .to( [$Map.daysList, $Map.timesList] , SPEED_MAP.MOVE , {
        left    : w,
        opacity : 1,
        ease: Expo.easeOut
      });

    return TL;
  }

  function getBackAnimation( w ) {
    var      
      SPEED_MAP = {
        HIDE : .15,
        MOVE : .5
      },
      TL = new TimelineMax();

    TL.to( [$Map.daysList, $Map.timesList] , SPEED_MAP.HIDE , {
       opacity : 0
      })
      .to( [$Map.daysList, $Map.timesList] , SPEED_MAP.MOVE , {
        left    : w,
        opacity : 1,
        ease: Expo.easeOut
      });

    return TL;
  }

  function getRePotsitionAnimation( w ) {
    var      
      SPEED_MAP = {
        MOVE : .4
      },
      TL = new TimelineMax();

    TL.to( [$Map.daysList, $Map.timesList] , SPEED_MAP.MOVE , {
        left    : w,
        ease: Expo.easeOut
      });

    return TL;
  }

  function setGoValue() {
    Value.count += 1
    Value.position = Value.position - Value.clnWidth;
    return Value.position;
  }

  function setBackValue() {
    Value.count -= 1
    Value.position = Value.position + Value.clnWidth;
    return Value.position;
  }

}