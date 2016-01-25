var m            = require( 'mithril' );
var calendar     = require( '../ui/calendar' );
var card         = require( '../ui/card' );
var times        = require( '../ui/times' );
var timeArea     = require( '../data/timeArea' );
var fixedHeader  = require( '../ui/times/fixedHeader' );
var eventManager = require( '../ui/card/eventManager' );
var check        = require( '../ui/card/check' );
// var socket       = require( 'socket.io-client' )( 'http://192.168.0.134:8015' );

module.exports = function ReserveModule() {

  var Reserve = function ( data ) {
    this.timestamp = m.prop( data.timestamp );
    this.position  = m.prop( data.position );
    this.place     = m.prop( data.place );
    this.hour      = m.prop( data.hour );
    this.member    = m.prop( data.member );
    this.person    = m.prop( data.person );
    this.date      = m.prop( data.date );
  }
  //   console.log( 'connect' )
  // });
  // socket.on( 'disconnect', function(){
  //    console.log( 'disconnect' )
  // });


    // function Save( reserve ) {
    //   socket.emit( 'saveData' , reserve );
    // }

    Reserve.save = function( reserve ) {
      m.request({ method: "POST", url: "/reserved" , data: reserve });
    }

    // Reserve.list = function() {
    //   m.request({ method: "GET", url: "/reserved"  });
    // }

    Reserve.cancel = function( reserve ) {
      m.request({ method: "POST", url: "/cancel" , data: reserve });
    }

  // ビューモデル
  var vm = {
    init : function() {
      vm.dObj      = m.prop( new Date() );
      vm.timestamp = m.prop('');
      vm.position  = m.prop('');
      vm.place     = m.prop('');
      vm.date      = m.prop('');
      vm.time      = m.prop('');
      vm.hour      = m.prop(0.5);
      vm.member    = m.prop('');
      vm.person    = m.prop('');
      vm.target    = m.prop('');
      vm.json      = m.prop('');
      vm.week      = m.prop(0);
      vm.notice    = m.prop('');
      vm.check     = m.prop(true);
      vm.urlStatus = m.prop('0');

      vm.clickSubmitButton = function(){
        var
          reserve   = [],
          obj       = {},
          timestamp = Math.floor( new Date().getTime() / 100 ),
          position  = vm.date() + '_' + vm.time();

        vm.timestamp( timestamp );
        vm.position( position );
        vm.member( getCardVal().member );
        vm.person( getCardVal().person );

        var reserve = vm.addReserve( vm.time() , getCardVal().hour );
        Reserve.save( reserve );

        vm.getJsonReq();

        function getCardVal() {
          return {
            hour   : $( '#cardHour' ).val(),
            member : $( '#cardMember' ).val(),
            person : $( '#cardPerson' ).val()
          }
        }
      },
      vm.addReserve = function( t , h ) {
        var
          Class = '',
          // list  = [],
          gainPosition = {},
          length , term;

        term   = getReserveTimes( t , h );
        length = term.length - 1;

        for ( var i = 0; i < length; i++ ) {
          gainPosition[ i ] = vm.date() + '_' + term[i];
        }
        reserve = new Reserve({
          timestamp : vm.timestamp(),
          position  : gainPosition,
          place     : vm.place(),
          hour      : h,
          member    : vm.member(),
          person    : vm.person(),
          date      : vm.date()
        });
        function getReserveTimes( time , hour ) {
          var
            hour        = String( hour ),
            timeList    = timeArea(),
            matchOrder  = timeList.indexOf( time ),
            arr         = [],
            length = ( matchOrder + 1 ) + hour * 2;

          for( var i = matchOrder; i < length; i++ ) {
            arr.push( timeList[i] )
          }
          return arr;
        }

        return reserve;
      },
      vm.cancelReserve = function() {
        var
          json    = vm.json(),
          target  = vm.target(),
          arr     = [],
          start   = 0,
          listNum = 0,
          stamp , length , num ;

        if( json && target ) {
          length = json.length;
          stamp  = target.attr( 'data-stamp' );
          for( var i = 0; i < length; i++ ) {
            num = i;
            if (json[i].timestamp == stamp) {
              arr.push(num)
            }
          }
          start   = arr[0];
          listNum = arr.length;
          json    = json.splice( start , listNum );
          arr     = [];
          Reserve.cancel( json );
        }
      },
      vm.getJsonReq = function() {
        m.request({ method: "GET", url: "/reserved"  })
          .then( function( value ){
            vm.json( value );
        });
      },
      vm.checkReserve = function( d,t,p ) {
        var
          json   = vm.json(),
          id     = vm.addDateClass( d ) + '_' + t + '_' + p,
          Class  = '',
          stamp  = '',
          hour   = 0,
          member = 0,
          person = '',
          first  = '',
          place , position;

        if( json ) {
          var length = json.length;
          for( var i = 0; i < length; i++ ){
            place    = json[i].place;
            var posiLength = Object.keys( json[i].position ).length;
            for( var j = 0; j < posiLength; j++ ){
              var reserve = json[i].position[ j ] + '_' + json[i].place;
              if ( reserve == id ){
                Class += 'reserved' + ' ' + place;
                stamp  = json[i].timestamp;
                hour   = json[i].hour;
                member = json[i].member;
                person = json[i].person;
                // first  = json[i].first;
                if ( j == 0 ) {
                  first = true;
                } else {
                  first = false;
                }
              }
            }
          }
        }
        return {
          Class  : Class,
          stamp  : stamp,
          hour   : hour,
          member : member,
          person : person,
          first  : first
        }
      },
      vm.setCancelTarget = function() {
        var
          reserved = $( '.reserved' );

        reserved.on( 'click' , function() {
          var self = $(this);
          vm.target( self );
        });
      },
      vm.addDateClass = function( d ) {
        return d.getFullYear() + "_" + (d.getMonth() + 1) + "_" + d.getDate();
      },
      vm.setWeek = function( dObj ) {
        var
          term = 7,  // ▼ _setting.scss：$week_weekTerm
          arr  = [],
          i    = vm.week(),
          d , day , date;

        var weekday = dObj.getDay();
        var monday  = dObj.getDate() - ( weekday - 1 ) + i ;
        for( var i = 0; i < term; i++ ){
          d = new Date();
          d.setDate( monday );
          d.setDate( d.getDate() + i );
          arr.push( d );
        }
        return arr;
      },
      vm.nextWeek = function() {
        var
          num = vm.week();
        num += 7;
        vm.week( num );
      },
      vm.prevWeek = function() {
        var
          num = vm.week();
        num -= 7;
        vm.week( num );
      }
    },
    test : function(){
       console.log(vm.json())
    },
    clear : function() {
      m.request({ method: 'GET', url: '/reset'  });
    },
    redraw : function() {
      m.request({ method: 'GET', url: '/reserved'  })
      .then( function(data){
        vm.json( data );
        m.redraw();
      });
    }
  };
  var Calendar = {

    controller : function() {
      vm.init();
      // vm.getSocket();
      vm.getJsonReq();
    },

    view : function () {

      // setInterval(function(){
      //   vm.getJsonReq();
      // } , 5000 );

      vm.setCancelTarget();

      function setWeekDay( d ) {
        var weekArr = [
          'sun' , 'mon', 'tue' , 'wed' , 'thu' , 'fri' , 'sat'
        ];
        return weekArr[d];
      }
      function setPlaces() {
        return [
          'P9A','P9B','P1A','P1B'
        ];
      }
      function addTodayClass( d ) {
        var
          Class  = '',
          calSt  = new Date().toLocaleDateString(),
          dSt    = d.toLocaleDateString();
        if ( calSt == dSt ) {
          Class = 'today';
        } else {
          Class = '';
        }
        return Class;
      }
      function addMultiProp() {
          var handlers = [].slice.call( arguments );
          return function execute(){
              var args = [].slice.call( arguments );
              var ctxt = this;
              handlers.forEach( function applyCtxt( fn ){
                  fn.apply( ctxt, args );
              } );
          };
      }
      function setCardPlace( p ) {
        var
          textMap = {
            'P9A' : '9F 大',
            'P9B' : '9F 小',
            'P1A' : '1F コンビニ側',
            'P1B' : '1F 窓口側'
          }
        return textMap[ p ];
      }
      function setCardDay( d ) {
        var
          arr   = [],
          year  = '', month = '', date  = '';

        if( d ) {
          arr   = d.split( '_' );
          year  = arr[0] + '年';
          month = arr[1] + '月';
          date  = arr[2] + '日';
        }
        return {
          year  : year,
          month : month,
          date  : date
        };
      }
      function setCardTime( t ) {
        var
          hour    = '',
          minutes = '',
          time    = '';

        if( t ) {
          hour    = t.substr( 0 , 2 );
          if ( hour.substr( 0 , 1 ) == '0' ){
            hour = hour.substr( 1 , 1 )
          }
          minutes = t.substr( 2 , 4 );
          time = hour + ':' + minutes;
        }
        return time;
      }
      function setTimeList( t ) {
        var
          time  = t,
          list  = timeArea(),
          order = list.indexOf(time),
          setTime = '';

        // console.log( day )
        if( order % 2 == 0 ){
          setTime = setCardTime( t )
        } else {
          setTime = '30'
        }
        return setTime;
      }
      function setInitialName( n ) {
        if( !n == '' ){
          return n.substr( 0 , 3 );
        }
      }
      return  m( '.contents' , { config : eventManager } , [
        m( 'headar#header' , { config: function( element , isInitialized , context){
          if( !isInitialized ) {
            fixedHeader();
          }
        }} , [
          m( 'h1' , 'Meeting Space Reservation' ),
          m( '.items' , [
            m( '.explain' , [
              m( 'ul' , [
                m( 'li' , m( 'p.box.P9A' , '' ) , m( 'p.text' , '9F/大' ) ),
                m( 'li' , m( 'p.box.P9B' , '' ) , m( 'p.text' , '9F/小' ) ),
                m( 'li' , m( 'p.box.P1A' , '' ) , m( 'p.text' , '1F/コンビニ側' ) ),
                m( 'li' , m( 'p.box.P1B' , '' ) , m( 'p.text' , '1F/窓口側' ) )
              ])
            ]),
            m( 'nav#nav' , [
              m( 'a#prev' , {
                onclick : vm.prevWeek
              } , [
                m( 'p' , '〈' )
              ]),
              m( 'a#next' , {
                onclick : vm.nextWeek
              } , [
                m( 'p' ,  '〉' )
              ]),
            ])
          ]),
        ]),
        m( '.testArea' , [
          m( 'button#test' , { onclick: vm.test } , 'test' ),
          m( 'button#test' , { onclick: vm.clear } , 'clear' ),
          m( 'button#test' , { onclick: vm.redraw } , 'redraw' ),
        ]),
        m( '#calendar' , [
          m( 'ul#timeZone' , timeArea().map(function ( t ) {
            return m( 'li.zone' , [
              m( 'p' , setTimeList( t ) )
            ])
          })),
          m( '#days' , [
            m( 'ul' , vm.setWeek( vm.dObj() ).map(function ( d ) {
              return  m( 'li' , [
                  m( 'p' , [
                    m( 'span.month' , d.getMonth() + 1 + '.' ),
                    m( 'span.date' , d.getDate() ),
                    m( 'span.day' , setWeekDay(d.getDay()) ),
                  ])
                ]);
              }))
          ]),
          m( '#times' , { config: times } , [
            m( 'ul#timesList' , vm.setWeek( vm.dObj() ).map(function ( d ) {
              return  m( 'li.date' , {
                class   : addTodayClass( d ),
                name    : vm.addDateClass( d )
              } , [
                m( '.timeArea' , timeArea().map(function ( t ) {
                  return  m( 'ul.time' , {
                      name  : t
                    } ,
                    setPlaces().map(function ( p ) {
                      return  m( 'li.place' , {
                          onclick : addMultiProp(
                            m.withAttr( 'data-place' , vm.place ),
                            m.withAttr( 'data-date'  , vm.date ),
                            m.withAttr( 'data-time'  , vm.time )
                            // m.withAttr( 'id'  , vm.check )
                          ),
                          id            : vm.addDateClass( d ) + '_' + t + '_' + p,
                          class         : vm.checkReserve( d,t,p ).Class,
                          'data-stamp'  : vm.checkReserve( d,t,p ).stamp,
                          'data-place'  : p,
                          'data-date'   : vm.addDateClass( d ),
                          'data-hour'   : vm.checkReserve( d,t,p ).hour,
                          'data-time'   : t,
                          'data-member' : vm.checkReserve( d,t,p ).member,
                          'data-person' : vm.checkReserve( d,t,p ).person,
                          'data-first'  : vm.checkReserve( d,t,p ).first
                        } ,  m( 'span.initial', setInitialName( vm.checkReserve( d,t,p ).person ) ) )
                    }));
                  }))
                ]);
            })),
          ])
        ]),
        m( 'form#card' , { config: function( element , isInitialized , context){
          if( !isInitialized ) {
            card();
          }
        }} , [
          m( '.header' , [
            m('h2', '予約カード'),
            m('p#closeBtn', '×')
          ]),
          m('ul' , [
            m('li.place', [
              m('h3', 'Place'),
              m( 'p#cardPlace.val' , setCardPlace( vm.place() ) )
            ]),
            m( 'li', [
              m( 'h3' , 'Date' ),
              m( 'p#cardDate.val' , [
                m( 'span.year' , setCardDay( vm.date()).year ),
                m( 'span.month' , setCardDay( vm.date()).month ),
                m( 'span.date' , setCardDay( vm.date()).date )
              ])
            ]),
            m('li.place', [
              m('h3', 'Time'),
              m( 'p#cardTime.val' , setCardTime( vm.time() ) )
            ]),
            m( 'li', [
              m( '.hourTitle' , [
                m( 'h3', 'Hour' ),
                m( 'p#hourNotice' , {
                  config: function( element , isInitialized , context){
                    check();
                  }
                } , '予約が入っています' )
              ]),
              m( '.number' , [
                m( '.sppinner.hour' , [
                  m( "input#cardHour[name='num'][type='number']" ),
                  m( 'p.up' , '▲' ),
                  m( 'p.down' , '▼' )
                ]),
                m( 'p#infoHour.info' , '' , m( 'span' , 'h' ) ),
                m( 'p.unit', 'h' )
              ])
            ]),
            m( 'li', [
              m( 'h3', 'Member' ),
              m( '.number' , [
                m( '.sppinner.member' , [
                  m( "input#cardMember[name='num'][type='number']" ),
                  m( 'p.up' , '▲' ),
                  m( 'p.down' , '▼' )
                ]),
                m( 'p#infoMember.info' , '' , m( 'span' , '人' ) ),
                m( 'p.unit', '人' )
              ])
            ]),
            m( 'li', [
              m( 'h3', 'Name' ),
              m( "input#cardPerson.name[name='name'][size='10'][type='text'][placeholder='name']" , vm.person() ),
              m( 'p#infoPerson.info' , '' ),
            ])
          ]),
          m('#submit', [
            m('p.send', { onclick: vm.clickSubmitButton } , '予約する' ),
            m('p.still' , '予約する' )
          ]),
          m('#cancel', [
            m('p', { onclick: vm.cancelReserve } , '予約を取り消す' )
          ])
        ])
      ]);
    }
  }

   m.mount( document.getElementById('app') , Calendar );

}