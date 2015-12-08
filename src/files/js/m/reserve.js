var m       = require( 'mithril' );

module.exports = function ReserveModule() {
  // モデルクラス
  var Reserve = function ( data ) {
    this.position = m.prop( data.position );
  }

    //クラス
    Reserve.save = function( reserve ) {
      localStorage.setItem( "position", JSON.stringify( reserve ) );
    }

    //クラス ：localStorageに保存してある文字列→JSON
    // ReserveモデルをJSONの各プロパティでインスタンス化して配列に保存。  
    Reserve.list = function() {
      var
        booking = [],
        str , obj;

      str = localStorage.getItem( "position" );

      if (str) {
          //localStorage から get した文字列をJSONに。
          var json = JSON.parse(str);

          for (var i = 0; i < json.length; i++) {
              booking.push( new Reserve( json[i] ));
          }
          // console.log(booking[0].position())
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
      vm.people   = m.prop('');
      vm.name     = m.prop('');
          
      vm.clickSubmitButton = function(){

        var
          reserve , position;

        // vm.position に getPosition() を格納
        vm.position( vm.getPosition() );

        //モデルの position を vm.position で初期化
        reserve = new Reserve({ position : vm.position() });
        // console.log(reserve);

        //※「インスタンス化したモデル」をpushする
        vm.list().push( reserve );

        vm.position( '' );
        Reserve.save( vm.list() )
        
      },
      vm.getPosition = function(){
        var
          position = '';

        position = vm.date() + '_' + vm.time() + '_' + vm.place();

        return position;
      },
      vm.getHour = function() {
        var
          hour = vm.hour();

        return hour;
      },
      vm.getMemberInfo = function(){
        var
          member = '';

        member = vm.people() + '_' + vm.name();

        return member;
      },
      vm.getReserveList = function(){

        var 
          data = localStorage.getItem( "position" ),
          list  = JSON.parse( data ),
          reserveList = [],
          prop;

        if ( data ) {

          var length = list.length;
          for( var i = 0; i < length; i++ ) {
            prop = list[i].position;
            reserveList.push( prop );
          }
          // console.log( list[0].position );
        }

        return reserveList;

      }
    },
    test : function(){
       // console.log(localStorage.getItem('position'))
       console.log( vm.getReserveList() );

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
      vm.getWeekDay = function( d ) {
        var weekArr = [
          'sun' , 'mon', 'tue' , 'wed' , 'thu' , 'fri' , 'sat'
        ];
        return weekArr[d];
      },
      vm.getWeekArr = function( dObj ) {
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
      vm.getTimeArea = function() {
        return [
          '0800','0830','0900','0930','1000','1030','1100','1130','1200','1230',
          '1300','1330','1400','1430','1500','1530','1600','1630','1700','1730',
          '1800','1830','1900','1930','2000','2030'
        ];
      },
      vm.getPlaces = function () {
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
          calendarId = addDateClass( d ) + '_' + t + '_' + p,
          length;

        length = idArr.length;

        Class = calendarId;
        for( var i = 0; i < length; i++ ){
          if ( idArr[i] == calendarId ){
            Class = 'reserved' + ' ' + calendarId;
          } 
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
            m( 'ul' , vm.getWeekArr( vm.dObj ).map(function ( d ) {
              return  m( 'li' , [
                  m( 'p' , [
                    m( 'span.date' , d.getDate() ),
                    m( 'span.day' , vm.getWeekDay(d.getDay()) ),
                  ])
                ]);
              }))
          ]),
          m( '#times' , [
            m( 'ul#uiTimesList' , vm.getWeekArr( vm.dObj ).map(function ( d ) {
              return  m( 'li' , {
                onclick: m.withAttr( 'name' , vm.date ),
                class  : addTodayClass( d ),
                name   : addDateClass( d )
              } , [
                m( '.timeArea' , vm.getTimeArea().map(function ( t ) {
                  return  m( 'ul.time' , {
                    onclick: addMultiProp(
                      m.withAttr( 'name' , vm.time )
                      // m.withAttr( 'name' ,  vm.date)
                      ),
                    name: t
                    } ,
                    vm.getPlaces().map(function ( p ) {
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
        m( 'form#reserve' , [
          m('h2', 'reserve'),
          m('ul', [
            // m('li', [
            //   m('h3', '場所'),
            //   m( 'label' , [
            //     m( "input[type='radio'][name='area'][value='9FA']" , {onclick: m.withAttr( "value", vm.place)})
            //   ] , '9F/大' ),
            //   m( 'label' , [
            //     m( "input[type='radio'][name='area'][value='9FB']" , {onclick: m.withAttr( "value", vm.place)})
            //   ] , '9F/小' ),
            //   m( 'label' , [
            //     m( "input[type='radio'][name='area'][value='1FA']" , {onclick: m.withAttr( "value", vm.place)})
            //   ] , '1F/窓口側' ),
            //   m( 'label' , [
            //     m( "input[type='radio'][name='area'][value='1FB']" , {onclick: m.withAttr( "value", vm.place)})
            //   ] , '1F/コンビニ側' )
            // ]),
            m( 'li', [
              m( 'h3' , '日にち' ),
              m( 'p#reserveDate' , vm.setTargetDate() )
            ]),
            m( 'li', [
              m( 'h3', '使用時間' ),
              m( "select", {onchange: m.withAttr( "value", vm.hour)}, [
                m( "option", '0' ),
                m( "option[value='0.5']", '0.5' ),
                m( "option[value='1']", '1' ),
                m( "option[value='1.5']", '1.5' ),
                m( "option[value='2']", '2' ),
                m( "option[value='2.5']", '2.5' ),
                m( "option[value='3']", '3' ),
                m( "option[value='3.5']", '3.5' ),
                m( "option[value='4']", '4' ),
                m( "option[value='4.5']", '4.5' ),
                m( "option[value='5']", '5' ),
                m( "option[value='8']", '終日' )
              ]),
              m( 'p', '時間' )
            ]),
            m( 'li', [
              m( 'h3', '人数' ),
              m( "input[name='num'][size='2'][type='number'][min='1'][max='20']" , {onchange: m.withAttr( "value", vm.people)} ),
              m( 'p', '名' )
            ]),
            m( 'li', [
              m( 'h3', '名前' ),
              m( "input[name='name'][size='10'][type='text']" , {onchange: m.withAttr( "value", vm.name)} )
            ])
          ]),
          m( 'a#submit' , { onclick: vm.clickSubmitButton } , '予約する' )
        ])
      ]);
    }
  }

  m.mount( document.getElementById('app') , Calendar );

}