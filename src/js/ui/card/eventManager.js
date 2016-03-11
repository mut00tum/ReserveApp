require( 'TweenMax' );
require( 'TimelineMax' );
var timeArea = require( '../../data/timeArea' );
var m        = require( 'mithril' );


module.exports = function EventManager() {
  m.startComputation();
  var
    Map = {
      card     : $( '#card' ),
      submit   : $( '#submit' ).find( '.send' ),
      cancel   : $( '#cancel' ),
      closeBtn : $( '#closeBtn' ),
      place    : $( '#timesList' ).find( '.place' ),
      reserved : $( '.reserved' )
    },
    Card = {
      place    : $( '#cardPlace' ),
      date     : $( '#cardDate' ),
      time     : $( '#cardTime' ),
      hour     : $( '#cardHour' ),
      member   : $( '#cardMember' ),
      person   : $( '#cardPerson' ),
      sppinner : $( '#card' ).find( '.sppinner' ),
      unit     : $( '#card' ).find( '.unit' ),
      info     : $( '#card' ).find( '.info' ),
      infoHour : $( '#infoHour' ),
      infoMember : $( '#infoMember' ),
      infoPerson : $( '#infoPerson' )
    },
    inputList = [ Card.hour , Card.member , Card.sppinner , Card.person ],
    infoList  = [ Card.info ],
    Size_Map = {
      card    : $( '#card' ).width(),
      padding : parseInt($('#card').css('padding-right'), 10)
    },
    SPEED = {
      OPEN  : .3,
      CLOSE : .5,
      BTN   : .3
    },
    DELAY = {
      OPEN   : .1,
      CLOSE  : .1,
      CANCEL : .4,
      SHOW   : .3
    },
    EASE = {
      OPEN  : Power2.easeOut,
      CLOSE : Power2.easeIn,
      SUBMIT: Back.easeIn.config(1.7)
    },
    showList = [ Card.place , Card.date , Card.time ],
    current  = 'current',
    Class    = 'reserved';

  Map.place.on( 'click' , function(){
    var self = $( this );
    initCardVal();
    set().hide( infoList );
    set().show( inputList );

    if( self.hasClass( Class ) ) {
      set().hide( inputList );
      set().show( infoList );
    }
    showEffect();
    open();
  });

  Map.reserved.on( 'click' , function(){
    var self = $(this);
    setCardVal( self );
  })

  Map.submit.on( 'click' , function(){
    close();
  });

  Map.cancel.on( 'click' , function(){
    cancelClose( SPEED.BTN , EASE.CLOSE );
  });

  Map.closeBtn.on( 'click' , function(){
    close( SPEED.BTN , EASE.CLOSE );
  });

  function open() {
    var tween = TweenMax.to( Map.card , SPEED.OPEN ,{
      right : - Size_Map.padding,
      ease  : EASE.OPEN,
      delay : DELAY.OPEN,
      onComplete: function(){
        this.pause( this.totalDuration() );
      }
    });
  }

  function close ( speed , ease ) {
    var tween = TweenMax.to( Map.card , speed ,{
      right : - Size_Map.card - Size_Map.padding,
      ease  : ease,
      delay : DELAY.CLOSE,
      onComplete: function(){
        this.pause( this.totalDuration() );
      }
    });
  }

  function cancelClose ( speed , ease ) {
    var tween = TweenMax.to( Map.card , speed ,{
      right : - Size_Map.card - Size_Map.padding,
      ease  : ease,
      delay : DELAY.CANCEL,
      onComplete: function(){
        this.pause( this.totalDuration() );
      }
    });
  }

  function setOpen() {
    TweenMax.set( Map.card , {
      right : 0
    });
  }

  function removeCurrent() {
    Map.place.removeClass( current );
  }

  function set() {

    function show( list ) {
      TweenMax.set( list , {
        display : 'block'
      });
    }

    function hide( list ) {
      TweenMax.set( list , {
        display : 'none'
      });
    }

    return {
      show : show,
      hide : hide
    }
  }

  function showEffect() {
    TweenMax.set( showList , {
      bottom : -10,
      opacity : 0
    });

    var tween = TweenMax.staggerTo( showList , .2 , {
      bottom : 0,
      opacity : 1,
      delay: DELAY.SHOW,
      ease : Power4.easeOut,
      onComplete: function(){
        this.pause( this.totalDuration() );
      }
    } , .075 );
  }

  function initCardVal() {
    $( '#cardMember' ).val( 0 );
    $( '#cardPerson' ).val('');
    Card.infoHour.text('');
    Card.infoMember.text('');
    Card.infoPerson.text('');
  }

  function setCardVal( self ) {
    var timeList   = timeArea();
    timeList.shift();
    timeList.push( '2100' );
    var hour       = self.data( 'hour' );
    var matchOrder = timeList.indexOf( self.data( 'time' ) );
    var afterOrder = matchOrder + hour;
    var time       = timeList[ afterOrder ];

    var
      hourText = '',
      minutes  = '',
      timeText = '';

    if( time ) {
      hourText = time.substr( 0 , 2 );
      if ( hourText.substr( 0 , 1 ) == '0' ){
        hourText = hourText.substr( 1 , 1 )
      }
    }
    minutes  = time.substr( 2 , 4 );
    timeText = hourText + ':' + minutes;

    Card.infoHour.text( timeText );
    Card.infoMember.text( self.data( 'member' ) );
    Card.infoPerson.text( self.data( 'person' ) );
  }

  m.endComputation();
}