var m        = require( 'mithril' );
var calendar = require( '../ui/calendar/changeWeek' );
var card     = require( '../ui/card' );
var times    = require( '../ui/times' );

module.exports = function ReserveModule() {
 
  var Reserve = function ( data ) {
    this.timestamp = m.prop( data.timestamp );
    this.position  = m.prop( data.position );
    this.place     = m.prop( data.place );
    this.hour      = m.prop( data.hour );
    this.member    = m.prop( data.member );
    this.person    = m.prop( data.person );
  }

    Reserve.save = function( reserve ) {
      m.request({ method: "POST", url: "/reserved" , data: reserve });
    }

    Reserve.list = function() {
      return m.request({ method: "GET", url: "/reserved"  });           
    }

    Reserve.cancel = function( reserve ) {
      m.request({ method: "POST", url: "/cancel" , data: reserve });         
    }
  
  // ビューモデル
  var vm = {
    init : function() {
      vm.list      = Reserve.list();
      vm.timestamp = m.prop('');
      vm.position  = m.prop('');
      vm.place     = m.prop('');      
      vm.date      = m.prop('');
      vm.time      = m.prop('');
      vm.hour      = m.prop('');
      vm.member    = m.prop('');
      vm.person    = m.prop('');
      vm.reserved  = m.prop(false);
      vm.target    = m.prop('');
      vm.json      = m.prop('');
          
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
        vm.reserved( true );

        if ( getCardVal().hour > 0.5 ) {
          var gainReserve = vm.addGainReserve( vm.time() , getCardVal().hour );
          Reserve.save( gainReserve );
        } else {
          Reserve.save( vm.addReserve() );
        }

        m.request({ method: "GET", url: "/reserved"  })
        .then( function(data){
          vm.json( data );
          initCardVal();
        });

        function judge() {

        }

        function getCardVal() {
          return {
            place  : $( '#cardPlace' ).text(),
            date   : $( '#cardDate' ).text(),
            time   : $( '#cardTime' ).text(),
            hour   : $( '#cardHour' ).val(),
            member : $( '#cardMember' ).val(),
            person : $( '#cardPerson' ).val()
          }
        }
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

        return reserve        
      },
      vm.addGainReserve = function( t , h ) {
        var
          Class = '',
          list  = [],
          length , term , gainPosition;
      
        term   = getReserveTimes( t , h );
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
          list.push( reserve );
        }
        function getReserveTimes( time , hour ) {
          var
            hour        = String( hour ),
            timeList    = setTimeArea(),
            matchOrder  = timeList.indexOf( time ),
            arr         = [],
            hourValList = {
              '0.5': 1, '1': 2, '1.5': 3, '2': 4, '2.5': 5, '3': 6, '3.5': 7, '4': 8, '4.5': 9,
              '5': 10, '5.5': 11, '6': 12, '6.5': 13, '7': 14, '7.5': 15, '8': 16
            } ,
            length = ( matchOrder + 1 ) + hourValList[hour];
          for( var i = matchOrder; i < length; i++ ) {
            arr.push( timeList[i] )
          }
          return arr;
        }

        return list;
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
      }
    },
    test : function(){
       console.log(vm.json())
    },
    clear : function() {
      m.request({ method: "GET", url: "/reset"  });
    },
    redraw : function() {
      m.request({ method: "GET", url: "/reserved"  })
      .then( function(data){
        vm.json( data );
        m.redraw();
        initCardVal();
      });
    }
  };

  var Calendar = {

    controller : function() {
      vm.init( );
      vm.getJsonReq();

      setTimeArea = function() {
        return [
          '0800','0830','0900','0930','1000','1030','1100','1130','1200','1230',
          '1300','1330','1400','1430','1500','1530','1600','1630','1700','1730',
          '1800','1830','1900','1930','2000','2030'
        ];
      },
      addDateClass = function( d ) {
        return d.getFullYear() + "_" + (d.getMonth() + 1) + "_" + d.getDate();
      },
      getReservePsition = function ( json , i ) {
        return json[i].position + '_' + json[i].place;
      },
      initCardVal = function() {
        $( '#cardHour' ).val( 0 );
        $( '#cardMember' ).val( 0 );
        $( '#cardPerson' ).val('');
        vm.hour( 0 );
        vm.member( 0 );
        vm.person( '' );
      },
      checkReserve = function( d,t,p ) {
        var
          json   = vm.json(),
          id     = addDateClass( d ) + '_' + t + '_' + p,
          Class  = '',
          stamp  = '',
          hour   = 0,
          member = 0,
          person = '',
          place , position;

        if( json ) {
          var length = json.length;
          for( var i = 0; i < length; i++ ){
            place    = json[i].place;
            position = getReservePsition( json , i )
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
          json      = vm.json(),
          target    = '',
          id , position , place;
        
        placeArea.on( 'click' , function() {
          initCardVal();
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
            var length = json.length;
            for( var i = 0; i < length; i++ ) {
              position = getReservePsition( json , i )
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
      }
    },

    view : function ( ctrl ) {
      getReserve();
      function setWeekDay( d ) {
        var weekArr = [
          'sun' , 'mon', 'tue' , 'wed' , 'thu' , 'fri' , 'sat'
        ];
        return weekArr[d];
      }
      function setWeekArr( dObj ) {
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
          minutes = t.substr( 2 , 4 );
          time = hour + ':' + minutes;
        }
        
        return time;
      }

      return  m( '.wrap' , { config: calendar } , [
        m( 'h1' , 'Meeting Space Reservation' ),
        m( 'nav#nav' , [
          m( '#prev' , [
            m( 'p' , '〈' )
          ]),
          m( '#next' , [
            m( 'p' ,  '〉' )
          ]),
        ]),
        m( 'button#test' , { onclick: vm.test } , 'test' ),
        m( 'button#test' , { onclick: vm.clear } , 'clear' ),
        m( 'button#test' , { onclick: vm.redraw } , 'redraw' ),
        m( '#calendar' , [
          m( '#days' , [
            m( 'ul' , setWeekArr( new Date() ).map(function ( d ) {
              return  m( 'li' , [
                  m( 'p' , [
                    m( 'span.date' , d.getDate() ),
                    m( 'span.day' , setWeekDay(d.getDay()) ),
                  ])
                ]);
              }))
          ]),
          m( '#times' , { config: times } , [
            m( 'ul#timesList' , setWeekArr( new Date() ).map(function ( d ) {
              return  m( 'li.date' , {
                class   : addTodayClass( d ),
                name    : addDateClass( d )
              } , [
                m( '.timeArea' , setTimeArea().map(function ( t ) {
                  return  m( 'ul.time' , {
                    name: t
                    } ,
                    setPlaces().map(function ( p ) {
                      return  m( 'li.place' , {
                        onclick : addMultiProp(
                          m.withAttr( 'data-place' , vm.place ),
                          m.withAttr( 'data-date'  , vm.date ),
                          m.withAttr( 'data-time'  , vm.time )
                        ),
                        id           : addDateClass( d ) + '_' + t + '_' + p,
                        class        : checkReserve( d,t,p ).Class,
                        'data-stamp' : checkReserve( d,t,p ).stamp,
                        'data-place' : p,
                        'data-date'  : addDateClass( d ),
                        'data-time'  : t                
                      })
                    }));
                  }))
                ]);
            })),
          ])          
        ]),
        m( 'form#card' , { config: card } , [
          m( '.header' , [
            m('h2', '予約カード'),
            m('p#closeBtn', '×')
          ]),
          m('ul', [
            m('li.place', [
              m('h3', 'Place'),
              m( 'p#cardPlace.val' , setCardPlace( vm.place() ) )
            ]),
            m( 'li', [
              m( 'h3' , 'Date' ),
              m( 'p#cardDate.val' , [
                m( 'span.year' , setCardDay(vm.date()).year ), 
                m( 'span.month' , setCardDay(vm.date()).month ),
                m( 'span.date' , setCardDay(vm.date()).date ) 
              ])
            ]),
            m('li.place', [
              m('h3', 'Time'),
              m( 'p#cardTime.val' , setCardTime( vm.time() ) )
            ]),
            m( 'li', [
              m( 'h3', 'Hour' ),
              m( '.number' , [
                m( '.sppinner.hour' , [
                  m( "input#cardHour[name='num'][type='number']" , vm.hour() ),
                  m( 'p.up' , '▲' ),
                  m( 'p.down' , '▼' )
                ] ),
                m( 'p.unit', 'h' )
              ])
            ]),
            m( 'li', [
              m( 'h3', 'Member' ),
              m( '.number' , [
                m( '.sppinner.member' , [
                  m( "input#cardMember[name='num'][type='number']" , vm.member() ),
                  m( 'p.up' , '▲' ),
                  m( 'p.down' , '▼' )
                ] ),
                m( 'p.unit', '人' )
              ])              
            ]),
            m( 'li', [
              m( 'h3', 'Name' ),
              m( "input#cardPerson.name[name='name'][size='10'][type='text'][placeholder='name']" , {
                value : vm.person()
              })
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