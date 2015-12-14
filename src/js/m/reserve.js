var m  = require( 'mithril' );

module.exports = function ReserveModule() {
  // モデルクラス
  var Reserve = function ( data ) {
    this.timestamp = m.prop( data.timestamp );
    this.position  = m.prop( data.position );
    this.place     = m.prop( data.place );
    this.hour      = m.prop( data.hour );
    this.member    = m.prop( data.member );
    this.person    = m.prop( data.person );
  }

    //クラス
    Reserve.save = function( reserve ) {
      // console.log( 'save:' + JSON.stringify(reserve) )
      localStorage.setItem( "reserved", JSON.stringify( reserve ) );
    }

    //クラス ：localStorageに保存してある文字列→JSON
    // ReserveモデルをJSONの各プロパティでインスタンス化して配列に保存。  
    Reserve.list = function() {
      var
        booking = [],
        str , obj;

      str = localStorage.getItem( "reserved" );

      if (str) {
          //localStorage から get した文字列をJSONに。
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
          
      vm.clickSubmitButton = function(){
        var
          reserve = [],
          obj     = {};

        vm.position( vm.getPosition() );
        vm.timestamp( vm.getTimestamp() );

        if ( vm.hour() > 0.5 ) {
          vm.addGainReserve( vm.time() , vm.hour() );
        } else {
          vm.addReserve();
        }
        //※「インスタンス化したモデル」をpushする
        Reserve.save( vm.list() )

        vm.position( '' );
        vm.place( '' );
        vm.hour( '' );
        vm.member( '' );
        vm.person( '' );
      },
      vm.addReserve = function() {
        reserve = new Reserve({
          timestamp : vm.timestamp(),
          position  : vm.position(),
          place     : vm.place(),
          hour      : vm.hour(),
          member    : vm.member(),
          person    : vm.person()
        });

        vm.list().push( reserve );
      },
      vm.addGainReserve = function( t , h ) {
        var
          Class        = '',
          date  = vm.date(),
          place = vm.place(),
          timestamp = vm.timestamp(),
          arr = [],
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
            person    : vm.person()
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
      // vm.getPositionList = function(){
      //   var 
      //     json         = vm.getJson(),
      //     positionList = [],
      //     position , place , hour , timestamp , prop;

      //   if ( json ) {
      //     var length = json.length;
      //     for( var i = 0; i < length; i++ ) {
      //       position  = json[i].position;
      //       place     = json[i].place;
      //       timestamp = json[i].timestamp;
      //       prop      = position + '_' + place+ '_' + timestamp;
      //       positionList.push( prop );
      //     }
      //   }
      //   return positionList;
      // },
      vm.addDateClass = function( d ) {
        return d.getFullYear() + "_" + (d.getMonth() + 1) + "_" + d.getDate();
      },
      vm.checkReserve = function( d,t,p ) {
        var
          Class      = '',
          stamp       = '',
          json       = vm.getJson(),
          calendarId = vm.addDateClass( d ) + '_' + t + '_' + p,
          length     = 0,
          place , src , reservePosition , time , place , position;
         
        Class  = calendarId;

        if( json ) {
          length = json.length;
        }

        for( var i = 0; i < length; i++ ){

          position  = json[i].position;
          place     = json[i].place;
          timestamp = json[i].timestamp;
          reservePosition  = position + '_' + place;

          if ( reservePosition == calendarId ){
            Class += ' ' + 'reserved';
            stamp = timestamp;

            
            switch( place ) {
              case '9FA':
                Class += ' ' + 'P9A';
                break;
              case '9FB':
                Class += ' ' + 'P9B';
                break;
              case '1FA':
                Class += ' ' + 'P1A';
                break;
              case '1FB':
                Class += ' ' + 'P1B';
                break;
            }
          } 
        }

        function splitText( src , num ) {
          var arr   = src.split('_');
          var val = arr[ num ];
          return val;
        }
        // console.log( stamp )
        return { 
          Class : Class,
          stamp : stamp
        }
      }
    },
    test : function(){
      // console.log( vm.getJson() )
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
          '9FA','9FB','1FA','1FB'
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
                onclick : m.withAttr( 'name' , vm.date ),
                class   : addTodayClass( d ),
                name    : vm.addDateClass( d )
              } , [
                m( '.timeArea' , vm.setTimeArea().map(function ( t ) {
                  return  m( 'ul.time' , {
                    onclick: addMultiProp(
                      m.withAttr( 'name' , vm.time )
                      // m.withAttr( 'name' ,  vm.date)
                      ),
                    name: t
                    } ,
                    vm.setPlaces().map(function ( p ) {
                      return  m( 'li.place' , {
                        onclick      : m.withAttr( 'name' , vm.place ),
                        class        : vm.checkReserve( d,t,p ).Class,
                        name         : p,
                        'data-stamp' : vm.checkReserve( d,t,p ).stamp
                      })
                    }));
                  }))
                ]);
            })),
          ])          
        ]),
        m( 'form#reserveCard' , [
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
                m( "input[name='num'][size='2'][type='number'][step='0.5'][min='0.5'][max='8']" , 
                  {onchange: m.withAttr( "value", vm.hour )} ),
                m( 'p.unit', 'h' )
              ])
            ]),
            m( 'li', [
              m( 'h3', 'Member' ),
              m( '.wrap' , [
                m( "input[name='num'][size='2'][type='number'][min='1'][max='20']" , 
                  {onchange: m.withAttr( "value", vm.member )} ),
                m( 'p.unit', '人' )
              ])              
            ]),
            m( 'li', [
              m( 'h3', 'Name' ),
              m( "input.val[name='name'][size='10'][type='text']" , {onchange: m.withAttr( "value", vm.person)} )
            ])
          ]),
          m('#submit', [
            m('p', { onclick: vm.clickSubmitButton } , '予約する' )
          ])
        ])
      ]);
    }
  }

  m.mount( document.getElementById('app') , Calendar );

}