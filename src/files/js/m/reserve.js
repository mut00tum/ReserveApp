var m  = require( 'mithril' );

module.exports = function ReserveModule() {
  // モデルクラス
  var Reserve = function ( data ) {
    this.position = m.prop( data.position );
    this.place    = m.prop( data.place );
    this.hour     = m.prop( data.hour );
    this.member   = m.prop( data.member );
    this.person   = m.prop( data.person );
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
      // console.log( 'load:' + str);

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
      vm.dObj     = new Date();
      vm.position = m.prop('');
      vm.reserve  = m.prop('');
      vm.list     = Reserve.list();
      vm.place    = m.prop('');      
      vm.date     = m.prop('');
      vm.time     = m.prop('');
      vm.hour     = m.prop('');
      vm.member   = m.prop('');
      vm.person   = m.prop('');
          
      vm.clickSubmitButton = function(){

        var
          reserve = [],
          position , place , hour , member , person;

        // vm.position に getPosition() を格納
        vm.position( vm.getPosition() );

        //モデルの プロパティ を 初期化
        reserve = new Reserve({ 
          position : vm.position(),
          place    : vm.place(),
          hour     : vm.hour(),
          member   : vm.member(),
          person   : vm.person()
        });

        //※「インスタンス化したモデル」をpushする
        vm.list().push( reserve );
        
        vm.position( '' );
        vm.place( '' );
        vm.hour( '' );
        vm.member( '' );
        vm.person( '' );

        Reserve.save( vm.list() )        
      },
      vm.getPosition = function(){
        var
          position = '';

        position = vm.date() + '_' + vm.time();

        return position;
      },
      vm.getReserveList = function(){

        var 
          data = localStorage.getItem( "reserved" ),
          list  = JSON.parse( data ),
          reserveList = [],
          position , place , prop;

        if ( data ) {
          var length = list.length;
          for( var i = 0; i < length; i++ ) {
            position = list[i].position;
            place    = list[i].place;
            prop     = position + '/' + place;
            reserveList.push( prop );
          }
        }

        return reserveList;

      }
    },
    test : function(){
       console.log(localStorage.getItem('reserved'))
       // console.log( vm.getReserveList() );
       // vm.getReserveList()
       // Reserve.list()

    },
    clear : function() {
      localStorage.clear();
    }
  };

  var Calendar = {

    controller : function() {
      // console.log(vm)

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
          term = 63,  // ▼ CSS：#days ul,#times ul{ width }
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
          '9F_A','9F_B','1F_A','1F_B'
        ];
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
          // date   = addDateClass( d );

        if ( calSt == dSt ) {
          Class = 'today';
        } else {
          Class = '';
        }
        return Class;
      }

      function addDateClass( d ) {
        return d.getFullYear() + "_" + (d.getMonth() + 1) + "_" + d.getDate();
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

      function checkReserve( d,t,p ) {

        var
          Class = '',
          idArr = vm.getReserveList(),
          calendarId = addDateClass( d ) + '_' + t + '/' + p,
          length , place;

        length = idArr.length;

        Class = calendarId;
        for( var i = 0; i < length; i++ ){
          if ( idArr[i] == calendarId ){
            
            place = splitText( idArr[i] );
            // console.log(place)
            switch( place ) {
              case '9F_A':
                Class = 'reserved' + ' ' + 'P9A' + ' ' + calendarId;
                break;
              case '9F_B':
                Class = 'reserved' + ' ' + 'P9B' + ' ' + calendarId;
                break;
              case '1F_A':
                Class = 'reserved' + ' ' + 'P1A' + ' ' + calendarId;
                break;
              case '1F_B':
                Class = 'reserved' + ' ' + 'P1B' + ' ' + calendarId;
                break;
            }
          } 
        }

        function splitText( str ) {
          var arr   = str.split('/');
          var place = arr[1];
          return place;
        }

        return Class;

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
                onclick: m.withAttr( 'name' , vm.date ),
                class  : addTodayClass( d ),
                name   : addDateClass( d )
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
                        onclick : m.withAttr( 'name' , vm.place ),
                        // id      : addDateClass( d ) + '_' + t + '_' + p,
                        class   : checkReserve( d,t,p ),
                        name    : p
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
              m( 'p.val' , vm.setTargetDate() )
            ]),
            m('li.place', [
              m('h3', 'Time'),
              m( 'p.val' , vm.time() )
            ]),
            // m( 'li', [
            //   m( 'h3', 'Hour' ),
            //   m( "select.val", {onchange: m.withAttr( "value", vm.hour)}, [
            //     m( "option", '0' ),
            //     m( "option[value='0.5']", '0.5' ),
            //     m( "option[value='1']", '1' ),
            //     m( "option[value='1.5']", '1.5' ),
            //     m( "option[value='2']", '2' ),
            //     m( "option[value='2.5']", '2.5' ),
            //     m( "option[value='3']", '3' ),
            //     m( "option[value='3.5']", '3.5' ),
            //     m( "option[value='4']", '4' ),
            //     m( "option[value='4.5']", '4.5' ),
            //     m( "option[value='5']", '5' ),
            //     m( "option[value='8']", '終日' )
            //   ]),
            //   m( 'p', 'h' )
            // ]),
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
          m( 'a#submit' , { onclick: vm.clickSubmitButton } , '予約する' )
        ])
      ]);
    }
  }

  m.mount( document.getElementById('app') , Calendar );

}