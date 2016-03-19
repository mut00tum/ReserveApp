require( 'TweenMax' );
require( 'TimelineMax' );
var timeArea = require( '../../data/timeArea' );
var m        = require( 'mithril' );

module.exports = function EventManager() {
  // m.startComputation();
  var
    Submit = $( '#submit' ),
    Map = {
      card     : $( '#card' ),
      submit   : Submit.find( '.send' ),
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
    inputList = [ Card.hour, Card.member, Card.sppinner, Card.person, Submit ],
    infoList  = [ Card.info, Map.cancel ],
    Size_Map = {
      card    : $( '#card' ).width(),
      padding : parseInt($('#card').css('padding-right'), 10)
    },
    SPEED = {
      OPEN  : .5,
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

  //init
  (function(){
    TweenMax.set( Map.card , {
      x: Size_Map.card
    });
  })();

  Map.place.on( 'click' , function(){
    var self = $( this );
    initCardVal();
    listFunc().hide( infoList );
    listFunc().show( inputList );

    if( self.hasClass( Class ) ) {
      listFunc().hide( inputList );
      listFunc().show( infoList );
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
    TweenMax.to( Map.card , SPEED.OPEN ,{
      x    : 0,
      ease : EASE.OPEN,
      onComplete: function(){
        this.pause( this.totalDuration() );
      }
    });
  }

  function close ( speed , ease ) {
    TweenMax.to( Map.card , speed ,{
      x    : Size_Map.card,
      ease : ease,
      onComplete: function(){
        this.pause( this.totalDuration() );
      }
    });
  }

  function cancelClose ( speed , ease ) {
    TweenMax.to( Map.card , speed ,{
      x     : Size_Map.card,
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

  function listFunc() {
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
    TweenMax.to( showList , .1 , {
      bottom : -10,
      opacity : 0,
      onComplete: function(){
        this.pause( this.totalDuration() );
      }
    });

    TweenMax.staggerTo( showList , .2 , {
      bottom : 0,
      opacity : 1,
      delay: DELAY.SHOW,
      ease : Power4.easeOut
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
    Card.infoMember.text( self[0].getAttribute( 'data-member' ) );
    Card.infoPerson.text( self[0].getAttribute( 'data-person' ) );
  }

  // m.endComputation();
}