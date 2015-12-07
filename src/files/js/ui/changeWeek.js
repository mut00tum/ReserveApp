require( 'TweenMax' );
require( 'TimelineMax' );
var resize  = require( './resize' );

module.exports = function ChangeWeek() {
  var
    Id_Map = {
      prev      : document.getElementById('prev'),
      next      : document.getElementById('next'),
      calendar  : document.getElementById('calendar'),
      times     : document.getElementById('times'),
      daysList  : document.querySelectorAll('#days > ul'),
      timesList : document.getElementById('uiTimesList')
    },
    Value_Map = {
      count    : 0,
      position : 0,
      clnWidth : 0
    };

  var 
    dates      = Id_Map.timesList.children,
    dateLength = dates.length / 7;

  setHide( Id_Map.prev );
  resize( setClnPosition );

  Id_Map.next.onclick = function(){
    setClnWidht();
    setGoValue();

    if( Math.abs(Value_Map.position) == Value_Map.clnWidth ) {
      setShow( Id_Map.prev );
    }

    if( Math.abs(Value_Map.position) >= Value_Map.clnWidth * ( dateLength - 1 ) ) {
      setHide( Id_Map.next );
    }
    
    getGoAnimation( Value_Map.position );
  }

  Id_Map.prev.onclick = function(){

    setClnWidht();

    if( Math.abs( Value_Map.position ) == Value_Map.clnWidth ) {
      setHide( Id_Map.prev );
    }

    if( Math.abs(Value_Map.position) >= Value_Map.clnWidth * ( dateLength - 2 ) ) {
      setShow( Id_Map.next );
    }

    setBackValue();
    getGoAnimation( Value_Map.position );
  }

  function setClnPosition() {
    var
      num   = Value_Map.count,
      value = getMoveWidth();
    
    Value_Map.position = - ( value * ( num ) );
    getRePotsitionAnimation( Value_Map.position );

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

  function setClnWidht() {
    Value_Map.clnWidth = getMoveWidth();
  }

  function getMoveWidth() {
    var width = Id_Map.times.clientWidth;
    return width;
  }

  function getGoAnimation( w ) {
    var      
      SPEED_MAP = {
        HIDE : .15,
        MOVE : .5
      },
      TL = new TimelineMax();

   TL.to( [Id_Map.daysList, Id_Map.timesList] , SPEED_MAP.HIDE , {
        opacity : 0
      })
      .to( [Id_Map.daysList, Id_Map.timesList] , SPEED_MAP.MOVE , {
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

    TL.to( [Id_Map.daysList, Id_Map.timesList] , SPEED_MAP.HIDE , {
       opacity : 0
      })
      .to( [Id_Map.daysList, Id_Map.timesList] , SPEED_MAP.MOVE , {
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

    TL.to( [Id_Map.daysList, Id_Map.timesList] , SPEED_MAP.MOVE , {
        left    : w,
        ease: Expo.easeOut
      });

    return TL;
  }

  function setGoValue() {
    Value_Map.count += 1
    Value_Map.position = Value_Map.position - Value_Map.clnWidth;
    return Value_Map.position;
  }

  function setBackValue() {
    Value_Map.count -= 1
    Value_Map.position = Value_Map.position + Value_Map.clnWidth;
    return Value_Map.position;
  }

}