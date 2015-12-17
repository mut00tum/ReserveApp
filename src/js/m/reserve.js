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
      vm.target    = m.prop('');
          
      vm.clickSubmitButton = function(){
        var
          reserve = [],
          obj     = {};
        vm.timestamp( vm.getTimestamp() );
        vm.position( vm.getPosition() );
        vm.member( vm.getCardVal().member );
        vm.person( vm.getCardVal().person );
        vm.reserved( true );

        if ( vm.getCardVal().hour > 0.5 ) {
          vm.addGainReserve( vm.time() , vm.getCardVal().hour );
        } else {
          vm.addReserve();
        }
        Reserve.save( vm.list() )
        vm.initCardVal();
      },
      vm.clickCancelButton = function() {
       
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
          length , term , gainPosition;
      
        term   = vm.getReserveTimes( t , h );
        length = term.length - 1;

        for ( var i = 0; i < length; i++ ) {
          gainPosition = vm.date() + '_' + term[i];
          reserve = new Reserve({ 
            timestamp : vm.timestamp(),
            position  : gainPosition,
            place     : vm.place(),
            hour      : h,
            member    : vm.member(),
            person    : vm.person(),
            reserved  : vm.reserved()
          });
          vm.list().push( reserve );
        }
      },
      vm.cancelReserve = function() {
        // m.startComputation();
        var
          json    = vm.getJson(),
          target  = vm.target(),
          arr     = [],
          start   = 0,
          listNum = 0,
          stamp , num ;

        if( json && target ) {
          stamp  = target.attr( 'data-stamp' );
          for( var i = 0; i < json.length; i++ ) {
            num = i;
            if (json[i].timestamp == stamp) {
              arr.push(num)
            }
          }
          start   = arr[0];
          listNum = arr.length;
          json.splice( start , listNum );
          arr     = [];
          Reserve.save( json );
        }
        // m.endComputation();
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
      vm.getReservePsition = function ( json , i ) {
        return json[i].position + '_' + json[i].place;
      },
      vm.getCardVal = function() {
        return {
          place  : $( '#cardPlace' ).text(),
          date   : $( '#cardDate' ).text(),
          time   : $( '#cardTime' ).text(),
          hour   : $( '#cardHour' ).val(),
          member : $( '#cardMember' ).val(),
          person : $( '#cardPerson' ).val()
        }
      },
      vm.initCardVal = function() {
        $( '#cardHour' ).val('');
        $( '#cardMember' ).val('');
        $( '#cardPerson' ).val('');
        vm.hour( 0 );
        vm.member( 0 );
        vm.person( '' );
      },
      vm.checkReserve = function( d,t,p ) {
        var
          json   = vm.getJson(),
          id     = vm.addDateClass( d ) + '_' + t + '_' + p,
          Class  = '',
          stamp  = '',
          hour   = 0,
          member = 0,
          person = '',
          place , position;
        
        if( json ) {
          length = json.length;
        
          for( var i = 0; i < length; i++ ){
            place    = json[i].place;
            position = vm.getReservePsition( json , i )
            if ( position == id ){
              Class += ' ' + 'reserved' + ' ' + place;
              stamp  = json[i].timestamp;
            } 
          }
        }
        return { 
          Class : Class,
          stamp : stamp
        }
      },
      getReserve = function() {
        var
          reserved  = $('.reserved'),
          placeArea = $('.place'),
          json      = vm.getJson(),
          target    = '',
          id , position , place;
        
        placeArea.on( 'click' , function() {
          vm.initCardVal();
          if( $(this).hasClass( 'reserved' ) ){
            setCard( $(this) );
          }
        });

        reserved.on( 'click' , function() {
          setCard( $(this) );
          vm.target( $(this) );
        });

        function setCard( t ) {
          if( json ){          
            id = t.attr( 'id' );
            for( var i = 0; i < json.length; i++ ) {
              position = vm.getReservePsition( json , i )
              if (position == id) {
                $( '#cardHour' ).val( json[i].hour ),
                $( '#cardMember' ).val( json[i].member ),
                $( '#cardPerson' ).val( json[i].person )
                vm.hour( json[i].hour )
                vm.member( json[i].member )
                vm.person( json[i].person )
              }
            }
          }
        }
        // return {
        //   cancelReserve : cancelReserve
        // }
      }
    },

    view : function () {

      getReserve();
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
                        ),
                        id           : vm.addDateClass( d ) + '_' + t + '_' + p,
                        class        : vm.checkReserve( d,t,p ).Class,
                        'data-stamp' : vm.checkReserve( d,t,p ).stamp,
                        'data-place' : p,
                        'data-date'  : vm.addDateClass( d ),
                        'data-time'  : t                
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
              m( 'p#cardPlace.val' , vm.place() )
            ]),
            m( 'li', [
              m( 'h3' , 'Date' ),
              m( 'p#cardDate.val' , vm.date() )
            ]),
            m('li.place', [
              m('h3', 'Time'),
              m( 'p#cardTime.val' , vm.time() )
            ]),
            m( 'li', [
              m( 'h3', 'Hour' ),
              m( '.wrap' , [
                m( "input#cardHour[name='num'][size='2'][type='number'][step='0.5'][min='0.5'][max='8']" , {
                  value : vm.hour()
                }),
                m( 'p.unit', 'h' )
              ])
            ]),
            m( 'li', [
              m( 'h3', 'Member' ),
              m( '.wrap' , [
                m( "input#cardMember[name='num'][size='2'][type='number'][min='1'][max='20']" , {
                  value : vm.member()
                }),
                m( 'p.unit', '人' )
              ])              
            ]),
            m( 'li', [
              m( 'h3', 'Name' ),
              m( "input#cardPerson.val[name='name'][size='10'][type='text']" , {
                value : vm.person()
              })
            ])
          ]),
          m('#submit', [
            m('p', { onclick: vm.clickSubmitButton } , '予約する' )
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