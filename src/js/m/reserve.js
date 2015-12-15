var m  = require( 'mithril' );

module.exports = function ReserveModule() {
 
  var Reserve = function ( data ) {
    this.timestamp = m.prop( data.timestamp );
    this.position  = m.prop( data.position );
    this.place     = m.prop( data.place );
    this.hour      = m.prop( data.hour );
    this.member    = m.prop( data.member );
    this.person    = m.prop( data.person );
    this.reserved  = m.prop( data.reserved );
  }

    Reserve.save = function( reserve ) {
      localStorage.setItem( "reserved", JSON.stringify( reserve ) );
    }

    Reserve.list = function() {
      var
        booking = [],
        str , obj;

      str = localStorage.getItem( "reserved" );

      if (str) {
          var json = JSON.parse(str);
          for (var i = 0; i < json.length; i++) {
            booking.push( new Reserve( json[i] ) );
          }
      }

    return m.prop( booking );
  }
  
  // ビューモデル
  var vm = {
    init : function() {
      vm.dObj      = new Date();
      vm.timestamp = m.prop('');
      vm.position  = m.prop('');
      vm.list      = Reserve.list();
      vm.place     = m.prop('');      
      vm.date      = m.prop('');
      vm.time      = m.prop('');
      vm.hour      = m.prop('');
      vm.member    = m.prop('');
      vm.person    = m.prop('');
      vm.reserved  = m.prop(false);
          
      vm.clickSubmitButton = function(){
        var
          reserve = [],
          obj     = {};
        // console.log( vm.reserved() )
        vm.position( vm.getPosition() );
        vm.timestamp( vm.getTimestamp() );
        vm.member( vm.getCardVal().member );
        vm.person( vm.getCardVal().person );
        vm.reserved( true );

        if ( vm.getCardVal().hour > 0.5 ) {
          vm.addGainReserve( vm.time() , vm.getCardVal().hour );
        } else {
          vm.addReserve();
        }

        Reserve.save( vm.list() )

        vm.position( '' );
        vm.place( '' );
        vm.hour( '' );
        vm.member( '' );
        vm.person( '' );
        vm.initCardVal();
      },
      vm.addReserve = function() {
        reserve = new Reserve({
          timestamp : vm.timestamp(),
          position  : vm.position(),
          place     : vm.place(),
          hour      : vm.hour(),
          member    : vm.member(),
          person    : vm.person(),
          reserved  : vm.reserved()
        });

        vm.list().push( reserve );
      },
      vm.addGainReserve = function( t , h ) {
        var
          Class     = '',
          date      = vm.date(),
          place     = vm.place(),
          timestamp = vm.timestamp(),
          arr       = [],
          length , term , gainPosition , member , person;
      
        term   = vm.getReserveTimes( t , h );
        length = term.length - 1;

        for ( var i = 0; i < length; i++ ) {
          gainPosition = date + '_' + term[i];
          reserve = new Reserve({ 
            timestamp : timestamp,
            position  : gainPosition,
            place     : place,
            hour      : h,
            member    : vm.member(),
            person    : vm.person(),
            reserved  : vm.reserved()
          });
          vm.list().push( reserve );
        }
      },
      vm.getPosition = function(){
        var position = vm.date() + '_' + vm.time();
        return position;
      },
      vm.getJson = function() {
        var 
          data = localStorage.getItem( "reserved" ),
          json = JSON.parse( data );

        return json
      },
      vm.getCardVal = function() {
        return {
          hour   : $( '#cardHour' ).val(),
          member : $( '#cardMember' ).val(),
          person : $( '#cardPerson' ).val()
        }
      },
      vm.initCardVal = function() {

        var
          $Map = {
            place : $( '#uiTimesList' ).find( '.reserved' )
          };

        if( $Map.place ) {
          $Map.place.on( 'click' , function(){
            console.log('on')
          })
        }
        

        $( '#cardHour' ).val(''),
        $( '#cardMember' ).val(''),
        $( '#cardPerson' ).val('')
      }
    },
    test : function(){
       console.log(localStorage.getItem('reserved'))
    },
    clear : function() {
      localStorage.clear();
    }
  };

  var Calendar = {

    controller : function() {
      vm.init( );
      vm.setTargetDate = function(){
        var
          arr = vm.date().split('_');
        return arr;
      },
      vm.setWeekDay = function( d ) {
        var weekArr = [
          'sun' , 'mon', 'tue' , 'wed' , 'thu' , 'fri' , 'sat'
        ];
        return weekArr[d];
      },
      vm.setWeekArr = function( dObj ) {
        var
          term = 35,  // ▼ layout.scss：#days ul,#times ul{ width }
          arr  = [],
          d , day , date;

        var weekday = dObj.getDay();
        var monday  = dObj.getDate() - ( weekday - 1 );

        for( var i = 0; i < term; i++ ){
          d = new Date();
          d.setDate( monday );
          d.setDate( d.getDate() + i );
          arr.push( d );
        }
        return arr;
      },
      vm.setTimeArea = function() {
        return [
          '0800','0830','0900','0930','1000','1030','1100','1130','1200','1230',
          '1300','1330','1400','1430','1500','1530','1600','1630','1700','1730',
          '1800','1830','1900','1930','2000','2030'
        ];
      },
      vm.setPlaces = function () {
        return [
          'P9A','P9B','P1A','P1B'
        ];
      },
      vm.hourValList = function() {
        return {
          '0.5': 1, '1': 2, '1.5': 3, '2': 4, '2.5': 5, '3': 6, '3.5': 7, '4': 8, '4.5': 9,
          '5': 10, '5.5': 11, '6': 12, '6.5': 13, '7': 14, '7.5': 15, '8': 16
        }
      },
      vm.getReserveTimes = function( time , hour ) {
        var
          // time        = vm.time(),
          hour        = String( hour ),
          timeList    = vm.setTimeArea(),
          hourValList = vm.hourValList(),
          matchOrder  = timeList.indexOf( time ),
          arr         = [],
          length;

        length = ( matchOrder + 1 ) + hourValList[hour];

        for( var i = matchOrder; i < length; i++ ) {
          arr.push( timeList[i] )
        }
        return arr;
      },
      vm.getTimestamp = function ( d ) {
        var stamp =  Math.floor( new Date().getTime() / 100 );
        return stamp;
      },
      vm.addDateClass = function( d ) {
        return d.getFullYear() + "_" + (d.getMonth() + 1) + "_" + d.getDate();
      },
      vm.checkReserve = function( d,t,p ) {
        var
          json       = vm.getJson(),
          calendarId = vm.addDateClass( d ) + '_' + t + '_' + p,
          length     = 0,
          Class      = '',
          stamp      = '',
          hour       = 0,
          member     = 0,
          person     = '',
          place , src , reservePosition , time , position;
         
        Class  = calendarId;
        if( json ) {
          length = json.length;
        }

        for( var i = 0; i < length; i++ ){
          position  = json[i].position;
          place     = json[i].place;
          
          reservePosition  = position + '_' + place;

          if ( reservePosition == calendarId ){
            Class += ' ' + 'reserved' + ' ' + place;
            stamp  = json[i].timestamp;
            hour   = json[i].hour;
            member = json[i].member;
            person = json[i].person;
          } 
        }
        return { 
          Class  : Class,
          stamp  : stamp,
          hour   : hour,
          member : member,
          person : person
        }
      }
    },

    view : function () {

      function getToday( ) {
        return new Date().toLocaleDateString();
      }

      function addTodayClass( d ) {
        var
          Class = '',
          calSt  = getToday(),
          dSt    = d.toLocaleDateString();

        if ( calSt == dSt ) {
          Class = 'today';
        } else {
          Class = '';
        }
        return Class;
      }

      function addMultiProp(){
          var handlers = [].slice.call( arguments );
          return function execute(){
              var args = [].slice.call( arguments );
              var ctxt = this;
              handlers.forEach( function applyCtxt( fn ){
                  fn.apply( ctxt, args );
              } );
          };
      }

      function getReserveVal() {

      var
        target = $('.reserved'),
        stamp;
      target.on( 'click' , function() {
        stamp = $(this).attr( 'data-stamp' );
        
        
        
      });


      }

      getReserveVal();

      return  m( '.wrapp' , [
        m( 'nav#nav' , [
          m( '#prev', [
            m( 'p' , '〈' )
          ]),
          m( '#next',[
            m( 'p' ,  '〉' )
          ]),
        ]),
        m( 'button#test' , { onclick: vm.test } , 'test' ),
        m( 'button#test' , { onclick: vm.clear } , 'clear' ),
        m( '#calendar' , [
          m( '#days' , [
            m( 'ul' , vm.setWeekArr( vm.dObj ).map(function ( d ) {
              return  m( 'li' , [
                  m( 'p' , [
                    m( 'span.date' , d.getDate() ),
                    m( 'span.day' , vm.setWeekDay(d.getDay()) ),
                  ])
                ]);
              }))
          ]),
          m( '#times' , [
            m( 'ul#uiTimesList' , vm.setWeekArr( vm.dObj ).map(function ( d ) {
              return  m( 'li' , {
                class   : addTodayClass( d ),
                name    : vm.addDateClass( d )
              } , [
                m( '.timeArea' , vm.setTimeArea().map(function ( t ) {
                  return  m( 'ul.time' , {
                    name: t
                    } ,
                    vm.setPlaces().map(function ( p ) {
                      return  m( 'li.place' , {
                        onclick : addMultiProp(
                          m.withAttr( 'data-place' , vm.place ),
                          m.withAttr( 'data-date'  , vm.date ),
                          m.withAttr( 'data-time'  , vm.time )
                          // m.withAttr( 'data-hour'  , vm.hour ),
                          // m.withAttr( 'data-person'  , vm.person ),
                          // m.withAttr( 'data-member'  , vm.member )
                        ),
                        class        : vm.checkReserve( d,t,p ).Class,
                        'data-place' : p,
                        'data-stamp' : vm.checkReserve( d,t,p ).stamp,
                        'data-date'  : vm.addDateClass( d ),
                        'data-time'  : t
                        // 'data-hour'  : vm.checkReserve( d,t,p ).hour,
                        // 'data-person' : vm.checkReserve( d,t,p ).person,
                        // 'data-member' : vm.checkReserve( d,t,p ).member                        
                      })
                    }));
                  }))
                ]);
            })),
          ])          
        ]),
        m( 'form#card' , [
          m('h2', '予約カード'),
          m('ul', [
            m('li.place', [
              m('h3', 'Place'),
              m( 'p.val' , vm.place() )
            ]),
            m( 'li', [
              m( 'h3' , 'Date' ),
              m( 'p.val' , vm.date() )
            ]),
            m('li.place', [
              m('h3', 'Time'),
              m( 'p.val' , vm.time() )
            ]),
            m( 'li', [
              m( 'h3', 'Hour' ),
              m( '.wrap' , [
                m( "input#cardHour[name='num'][size='2'][type='number'][step='0.5'][min='0.5'][max='8']" , {
                  value : vm.hour()
                  // value  : onchange ? m.withAttr( "value", vm.hour ) : "",
                  // onchange : m.withAttr( "value", vm.hour )
                }),
                m( 'p.unit', 'h' )
              ])
            ]),
            m( 'li', [
              m( 'h3', 'Member' ),
              m( '.wrap' , [
                m( "input#cardMember[name='num'][size='2'][type='number'][min='1'][max='20']" , {
                  value : vm.member()
                  // onchange: m.withAttr( "value", vm.member )
                }),
                m( 'p.unit', '人' )
              ])              
            ]),
            m( 'li', [
              m( 'h3', 'Name' ),
              m( "input#cardPerson.val[name='name'][size='10'][type='text']" , {
                value : vm.person()
                // onchange: m.withAttr( "value", vm.person)
              })
            ])
          ]),
          m('#submit', [
            m('p', { onclick: vm.clickSubmitButton } , '予約する' )
          ])
        ]),
        m( '#info' , [
          m( 'p' , 'info' )
        ])
      ]);
    }
  }

  m.mount( document.getElementById('app') , Calendar );

}