require( 'TweenMax' );
require( 'TimelineMax' );
var timeArea = require( '../../data/timeArea' );

module.exports = function SetHour() {
  var
    list       = timeArea(),
    allLength  = list.length,
    setlist    = list.concat(),
    card       = $( '#card' ),
    hour       = card.find('.hour'),
    Dom = {
      felid      : document.getElementById('cardHour'),
      selectList : document.getElementById('selectList')
    },
    Map = {
      time       : $( '#cardTime' ),
      place      : $( '#timesList' ).find( '.place' ),
      felid      : $( '#cardHour' ),
      selectList : $( '#selectList' ),
      item       : hour.find( 'li' )
    },
    flag = false;

    init();

    Map.place.on( 'click' , function(){
      var self    = $( this );
      var time    = String( self.data( 'time' ) );
      var index   = list.indexOf( time );
      var setTime = setlist[ index ];

      Dom.felid.setAttribute( 'data-cardhour' , 1 );
      Map.felid.val( toStringTime( setTime ) );
      setSelectItem( index + 1 )
    });

    Map.felid.on( 'click' , function(){
      if ( !flag ) {
        TweenMax.set( Map.selectList , {
          display: 'block',
          onComplete: function(){
            selectListFunc.show();
          }
        });
      }
    });

    $( '#app' ).on( 'click' , function(){
      if( flag ) {
        selectListFunc.hide();
      }
    });

    var selectListFunc = {
      show : function(){
        TweenMax.to( Map.selectList , .2 , {
          opacity: 1,
          onComplete: function(){
            flag = true;
          }
        });
      },
      hide : function(){
        TweenMax.to( Map.selectList , .2 , {
          opacity: 0,
          display: 'none',
          onComplete: function(){
            flag = false;
          }
        });
      }
    }

    function setOnFelid () {
      Map.selectList.find( 'li' ).on( 'click' , function(){
        var self  = $( this );
        var text  = self.text();
        var index = self.index();
        var val   = self.data( 'select' );

        Dom.felid.setAttribute( 'data-cardhour' , val );
        Map.felid.val( text );
        selectListFunc.hide();

        if( $( '#timesList' ).find( '.pre' ) ){
          $( '#timesList' ).find( 'li' ).removeClass( function(){return 'pre'} )
        }
      });
    }

    function init() {
      setlist.shift();
      setlist.push( '2100' );
      TweenMax.set( Map.selectList , {
        display: 'none',
        opacity: 0
      });
    }

    function toStringTime( time ) {
      return time.substr( 0 , 2 ) + ':' + time.substr( 2 , 4 )
    }

    function setSelectItem( index ) {
      var
        array = setlist.concat(),
        html  = '',
        $item = Map.selectList.find( 'li' ),
        val   = 0;

      if( $item ) {
        $item.remove();
      }
      for( var i = index - 1; i < allLength; i++ ) {
        var time = toStringTime( setlist[i] )
        val++;
        html += '<li data-select="' + val + '">' + time + '</li>';
      }
      Dom.selectList.insertAdjacentHTML( 'afterbegin' , html);

      setOnFelid();

    }

}