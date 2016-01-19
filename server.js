var
  express     = require( 'express' ),
  fs          = require( 'fs' ),
  bodyParser  = require( 'body-parser' ),
  MongoClient = require( 'mongodb' ).MongoClient,
  settings    = require( './settings' ),
  db , myCollection;

var app    = express();
var server = require( 'http' ).Server(app);
var io     = require( 'socket.io' )(server);


// ▼ err:Can't set headers after they are sent.
app.use(function(req,res,next){
  var _send = res.send;
  var sent  = false;
  res.send = function(data){
      if(sent) return;
      _send.bind(res)(data);
      sent = true;
  };
  next();
});

app.use(express.static( 'build' ));
app.use(bodyParser.json());
// server.use(bodyParser.json());

console.log( 'start listening at 8000' );
// app.listen(8000);
server.listen(8000);

MongoClient.connect("mongodb://" + settings.host + "/" + settings.db, function(err, mongodb) {
  if (err) { return console.dir(err); }
  console.log("Connected correctly to server");
  db           = mongodb;
  myCollection = db.collection( 'reserved' )
})

io.sockets.on( 'connection' , function( socket ) {
  // var data = getReserveData();
  // console.log( 'getReserveData: ' + data )

  sendReserve()

  setInterval(function() {
    sendReserve();
  } , 3000 );

  function sendReserve() {
    myCollection.find().toArray(function( err, item ) {
      if (err) { return console.log(err); }
      socket.emit( 'reserveData' , item , function( data ) {
          // console.log( data )
      })
    });
  }

  socket.on( 'saveData' , function( data ){
    // console.log( 'saveData:' + data )
    save( data )
  });
});

app.get("/reserved", function (req, res) {
  try {
    loading( function ( item ){
      res.send( item );
    });
    // console.log( 'loading' )
  } catch(e) {
    console.log( 'GET : error!' )
  }
});

app.post("/reserved", function (req, res) {
  try {
    // same( req , res );
    save( req.body );

    res.status(200).end();
    // console.log( 'save' )
  } catch(e) {
    console.log( 'POST : error!' )
  }
});

app.post("/cancel", function (req, res) {
  try {
    cancel( req, res );
    res.status(200).end();
    // console.log( 'cancel' )
  } catch(e) {
    console.log( 'POST : error!' );
    console.log( e )
  }
});

app.get("/reset", function (req, res){
  console.log( "MongoDB / reserved : clear!!" );
  myCollection.remove();
});

function loading( callback ) {
  myCollection.find().toArray(function( err, item ) {
    if (err) { return console.log(err); }
    callback(item);
  });
}

function getReserveData() {
  myCollection.find().toArray(function( err, item ) {
    if (err) { return console.log(err); }
    console.log( item )
    return item;
  });
}

function save( data ) {
  myCollection.insert( data, function( err, result ) {
    if (err) { return console.log(err); }
  });
}

function cancel( req ){
  var data = req.body;
  data.forEach( function( list ){
    myCollection.remove( { timestamp: list.timestamp } ,
      function( err, result ) {
        if (err) { return console.log(err); }
      }
    )
  })
}

// function same( req , res ){
//   var data = req.body;
//   data.forEach( function( list ){
//     if( myCollection.find({ position: list.position }) ) {
//       myCollection.find( { position: list.position } ,
//         function( err, result ) {
//           if (err) { return console.log(err); }
//           console.log( 'same' );
//         }
//       )
//     } else {
//       res.status(200).end();
//     }
//   })
//   res.status(200).end();
// }

