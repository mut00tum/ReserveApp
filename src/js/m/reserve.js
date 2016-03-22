var m            = require( 'mithril' );
var times        = require( '../ui/times' );
var timeArea     = require( '../data/timeArea' );
var fixedHeader  = require( '../ui/times/fixedHeader' );
var eventManager = require( '../ui/card/eventManager' );
var check        = require( '../ui/card/check' );
var setHour      = require( '../ui/card/setHour' );
var spinner     = require( '../ui/card/spinner' );

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

    Reserve.save = function( reserve ) {
      var
        firstData = [],
        booking = [],
        str , obj;

      str = localStorage.getItem( "storage" );
      var reserveData      = JSON.stringify( reserve );
      var parseReserveData = JSON.parse(reserveData);

      if( str == null ) {
        firstData.push( parseReserveData )
        var saveData = JSON.stringify( firstData )
        localStorage.setItem('storage', saveData );
      }

      if ( str ) {
        var data = JSON.parse( str );
        var length = Object.keys( data ).length;

        for (var i = 0; i < length; i++) {
          booking.push( data[i] );
        }

        booking.push( parseReserveData );
        var saveData = JSON.stringify( booking );
        localStorage.setItem( "storage", saveData );
      }
    }

    Reserve.cancel = function( reserve ) {
      var saveData = JSON.stringify( reserve );
      localStorage.setItem( "storage", saveData );
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
            hour   : document.getElementById('cardHour').getAttribute( 'data-cardhour' ),
            member : $( '#cardMember' ).val(),
            person : $( '#cardPerson' ).val()
          }
        }
      },
      vm.addReserve = function( t , h ) {
        var
          Class = '',
          gainPosition = '',
          length , term;

        term   = getReserveTimes( t , h );
        length = term.length;

        for ( var i = 0; i < length; i++ ) {
          if( i == length - 1 ){
            gainPosition += vm.date() + '_' + term[i];
          } else {
            gainPosition += vm.date() + '_' + term[i] + '/';
          }
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
            timeList    = timeArea(),
            matchOrder  = timeList.indexOf( time ),
            arr         = [],
            length      = matchOrder + Number(hour);

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

        if( json && target || !json == null ) {
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
          json.splice( start , 1 );
          arr     = [];

          Reserve.cancel( json );
        }
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

          // console.log( json )
        if( json ) {
          var length = json.length;
          for( var i = 0; i < length; i++ ){
            place = json[i].place;
            var posiList = json[i].position.split( '/' );
            var posiLength = posiList.length;
            for( var j = 0; j < posiLength; j++ ){
              var reserve = posiList[ j ] + '_' + json[i].place;
              if ( reserve == id ){
                Class += 'reserved' + ' ' + place;
                stamp  = json[i].timestamp;
                hour   = json[i].hour;
                member = json[i].member;
                person = json[i].person;
                if ( j == 0 ) {
                  first = true;
                } else {
                  first = false;
                }
              }
            }
          }
        } else {
          return false;
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
      vm.getJsonReq = function() {
        var
          booking = [],
          str     = '',
          data    = '';

        str  = localStorage.getItem( "storage" );
        data = JSON.parse(str);
        booking.push( data );
        vm.json( data );
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
      vm.getMonday = function( dObj , i ) {
        var weekday = dObj.getDay();
        return dObj.getDate() - ( weekday - 1 ) + i;
      },
      vm.setWeek = function( dObj ) {
        var
          term = 7,  // ▼ _setting.scss：$week_weekTerm
          arr  = [],
          d , day , date;

        var monday = vm.getMonday( dObj , vm.week() );

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
        vm.getJsonReq();
      },
      vm.prevWeek = function() {
        var
          num = vm.week();
        num -= 7;
        vm.week( num );
        vm.getJsonReq();
      }
    },
    test : function(){
       // console.log(vm.json())
       // console.log( localStorage.length );
       // console.log( localStorage.getItem('storage') )
    },
    clear : function() {
      // m.request({ method: 'GET', url: '/reset'  });
      localStorage.clear();
    },
    redraw : function() {
      // m.request({ method: 'GET', url: '/reserved'  })
      // .then( function(data){
      //   vm.json( data );
      //   m.redraw();
      // });
    }
  };
  var Calendar = {

    controller : function() {
      vm.init();
      vm.getJsonReq();
    },

    view : function () {

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
      function setTimeList( t ) {
        var
          time  = t,
          list  = timeArea(),
          order = list.indexOf(time),
          setTime = '';

        // console.log( order )
        if( order % 2 == 0 ){
          setTime = setCardTime( t )
        } else {
          setTime = t.substr( 2 , 4 );
        }
        return setTime;
      }
      function setCardPlace( p ) {
        var
          textMap = {
            'P9A' : 'A会議室',
            'P9B' : 'B会議室',
            'P1A' : 'C会議室',
            'P1B' : 'D会議室'
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
          hour = t.substr( 0 , 2 );
          if ( hour.substr( 0 , 1 ) == '0' ){
            hour = hour.substr( 1 , 1 )
          }
          minutes = t.substr( 2 , 4 );
          time = hour + ':' + minutes;
        }
        return time;
      }
      function setCardHour( time ) {
        return time.substr( 0 , 2 ) + ':' + time.substr( 2 , 4 )
      }
      function setInitialName( n ) {
        if( !n == '' ){
          return n.substr( 0 , 3 );
        }
      }
      return  m( '.contents' , { config: eventManager } , [
        m( 'headar#header' , { config: function( element , isInitialized , context){
          if( !isInitialized ) {
            fixedHeader();
          }
        }} , [
          m( 'h1' , 'ReserveApp' ),
          m( '.items' , [
            m( '.explain' , [
              m( 'ul' , [
                m( 'li' , m( 'p.box.P9A' , '' ) , m( 'p.text' , 'A会議室' ) ),
                m( 'li' , m( 'p.box.P9B' , '' ) , m( 'p.text' , 'B会議室' ) ),
                m( 'li' , m( 'p.box.P1A' , '' ) , m( 'p.text' , 'C会議室' ) ),
                m( 'li' , m( 'p.box.P1B' , '' ) , m( 'p.text' , 'D会議室' ) )
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
          m( '#times' , { config: function( element , isInitialized , context){
            times();
          }} , [
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
        m( 'form#card' ,
          { config: function( element , isInitialized , context){
            if( !isInitialized ) {
              spinner();
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
                m( 'p#hourNotice' , { config: check() } , '予約が入っています' )
              ]),
              m( '.number', { config: setHour() } , [
                m( '.sppinner.hour' , [
                  m( 'input#cardHour' , { 'data-cardhour': 1 ,  readonly:"readonly"}),
                  m( 'ul#selectList')
                ]),
                m( 'p#infoHour.info' , '' )
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
              m( "input#cardPerson.name[name='name'][size='10'][type='text'][maxlength='8'][placeholder='name']" , vm.person() ),
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