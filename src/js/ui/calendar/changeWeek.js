require( 'TweenMax' );
require( 'TimelineMax' );
var resize  = require( '../window/resize' );
var m = require( 'mithril' );

module.exports = function ChangeWeek() {
  m.startComputation();
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
    },
    Class = 'still';

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
    // ▼テスト
    // console.log( 'Value.count= '+ Value.count )
    // console.log( 'Value.position= '+ Value.position )

    if( Math.abs(Value.position) == Value.clnWidth ) {
      setShow( $Map.prev );
    }
    if( Math.abs(Value.position) >= Value.clnWidth * ( dateLength - 1 ) ) {
      setStill( $Map.next );
    }
    getGoAnimation( Value.position );
   });
 
  $Map.prev.on( 'click' , function(){

    Value.clnWidth = getMoveWidth();
    // ▼テスト
    // console.log( 'Value.count= '+ Value.count )
    // console.log( 'Value.position= '+ Value.position )

    if( Math.abs( Value.position ) == Value.clnWidth ) {
      setStill( $Map.prev );
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

  function getMoveWidth() {
    return $Map.times.prop('clientWidth');
  }

  function setStill( t ) {
    t.addClass( Class );
    // TweenMax.set( t , {
    //   pointerEvents : 'none',
    // });
  }

  function setShow( t ) {
    t.removeClass(function() {
      return Class;
    });
    // TweenMax.set( t , {
    //   pointerEvents : 'auto'
    // });
  }

  function setClnState( w ) {
    TweenMax.set( [$Map.daysList, $Map.timesList] , {
      left    : w,
      opacity : 1
    });
  }

  function getGoAnimation( w ) {
    var      
      SPEED_MAP = {
        HIDE : .15,
        MOVE : .3
      },
      TL = new TimelineMax();

   TL.to( [$Map.daysList, $Map.timesList] , SPEED_MAP.HIDE , {
        opacity : 0,
        // delay   : .1
      })
      .to( [$Map.daysList, $Map.timesList] , SPEED_MAP.MOVE , {
        left    : w,
        opacity : 1,
        // delay   : .15,
        ease: Expo.easeOut,
        onComplete: function(){
          this.pause( this.totalDuration() );
        }
      });

    return TL;
  }

  function getBackAnimation( w ) {
    var      
      SPEED_MAP = {
        HIDE : .15,
        MOVE : .3
      },
      TL = new TimelineMax();

    TL.to( [$Map.daysList, $Map.timesList] , SPEED_MAP.HIDE , {
        opacity : 0,
        // delay   : .1       
      })
      .to( [$Map.daysList, $Map.timesList] , SPEED_MAP.MOVE , {
        left    : w,
        opacity : 1,
        // delay   : .15,
        ease    : Expo.easeOut,
        onComplete: function(){
          this.pause( this.totalDuration() );
        }
        
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
  m.endComputation();
}