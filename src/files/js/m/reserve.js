var m       = require( 'mithril' );

module.exports = function ReserveModule() {
  // モデルクラス
  var Reserve = function ( data ) {
    this.position = m.prop( data.position );
  };

    //クラス
    Reserve.save = function( reserve ) {
      console.log( reserve );
      localStorage.setItem( "position", JSON.stringify( reserve ) );
    };

    //クラス ：localStorageに保存してある文字列→JSON
    // ReserveモデルをJSONの各プロパティでインスタンス化して配列に保存。  
    Reserve.list = function() {
      var
        booking = [],
        str , obj;

      str = localStorage.getItem( "position" );
      // console.log(str)

      if (str) {
          //localStorage から get した文字列をJSONに。
          var json = JSON.parse(str);
          // console.log( json )

          for (var i = 0; i < json.length; i++) {
              // console.log( json[i] )
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
      vm.list     = Reserve.list();
      vm.place    = m.prop('');      
      vm.date     = m.prop('');
      vm.time     = m.prop('');
      vm.hour     = m.prop('');
      vm.people   = m.prop('');
      vm.name     = m.prop('');
          
      vm.setTargetDate = function(){
        var
          arr = vm.date().split('_');
        return arr;
      },
      vm.clickSubmitButton = function(){

        var
          input , reserve , position;

        input = vm.place() + '/' + vm.date() + '/' + vm.time() + '/' + vm.hour() + '/' +  vm.people() + '/' + vm.name();

        // vm.position に input を格納
        vm.position( input );

        //モデルの position を vm.position で初期化
        reserve = new Reserve({ position : vm.position() });
        // console.log(reserve);

        //※「インスタンス化したモデル」をpushする
        vm.list().push( reserve );

        vm.position( '' );
        Reserve.save( vm.list() )
        
      },
      vm.addList = function ( position ){


      },
      vm.getPosition = function (){
        var
          position = '';

        return position;
      }
    },
    test : function (){
      
       // console.log(localStorage.getItem('position'))

      // for(var i = 0; i < localStorage.length ; i++) {
      //   console.log(localStorage.key(i));   
      // }

      // for(var i in localStorage) {
      //   console.log(localStorage[i]);
      // }
      // console.log( localStorage.getItem("0") );

    },
    clear : function() {
      localStorage.clear();
    }
  };

  var Calendar = {

    controller : function () {
      // console.log(vm)

      vm.init( );
      vm.getWeekDay = function ( d ) {
        var weekArr = [
          'sun' , 'mon', 'tue' , 'wed' , 'thu' , 'fri' , 'sat'
        ];
        return weekArr[d];
      },
      vm.getWeekArr = function ( dObj ) {
        var
          term = 84,  // ▼ CSS：#days ul,#times ul{ width }
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
      vm.getTimeArea = function () {
        return [
          '0800' , '0830' , '0900' , '0930' , '1000' , '1030' , '1100' , '1130' , '1200' , '1230' ,
          '1300' , '1330' , '1400' , '1430' , '1500' , '1530' , '1600' , '1630' , '1700' , '1730' ,
          '1800' , '1830' , '1900' , '1930' , '2000' , '2030'
        ];
      },
      vm.getPlaces = function () {
        return [
          '9F_A' , '9F_B' , '1F_A' , '1F_B'
        ];
      }
    },

    view : function () {

      function getToday( ) {
        return new Date().toLocaleDateString();
      }

      function addTodayClass( d ) {
        var
          Class = "",
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

      function multi(){
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
                class: addTodayClass( d ),
                name : addDateClass( d )
              } , [
                m( '.timeArea' , vm.getTimeArea().map(function ( t ) {
                  return  m( 'ul.time' , {
                    onclick: multi(
                      m.withAttr( 'name' , vm.time )
                      // m.withAttr( 'name' ,  vm.date)
                      ),
                    name: t
                    } ,
                    vm.getPlaces().map(function ( n ) {
                      return  m( 'li.place' , {
                        id: vm.getPosition(),
                        name: n
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
            m('li', [
              m('h3', '場所'),
              m( 'label' , [
                m( "input[type='radio'][name='area'][value='9FA']" , {onclick: m.withAttr( "value", vm.place)})
              ] , '9F/大' ),
              m( 'label' , [
                m( "input[type='radio'][name='area'][value='9FB']" , {onclick: m.withAttr( "value", vm.place)})
              ] , '9F/小' ),
              m( 'label' , [
                m( "input[type='radio'][name='area'][value='1FA']" , {onclick: m.withAttr( "value", vm.place)})
              ] , '1F/窓口側' ),
              m( 'label' , [
                m( "input[type='radio'][name='area'][value='1FB']" , {onclick: m.withAttr( "value", vm.place)})
              ] , '1F/コンビニ側' )
            ]),
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