var
  db,
  express     = require( 'express' ),
  fs          = require( 'fs' ),
  bodyParser  = require( 'body-parser' ),
  // mongo      = require( './mongo' ),
  MongoClient = require('mongodb').MongoClient,
  settings    = require('./settings');

var app = express();
app.use(function(req,res,next){
  var _send = res.send;
  var sent = false;
  res.send = function(data){
      if(sent) return;
      _send.bind(res)(data);
      sent = true;
  };
  next();
});
app.use(express.static( 'build' ));
app.use(bodyParser.json());

// var test = [
//       {"timestamp":14506889330,"position":"2015_12_23_0800","place":"P1B","hour":"1","member":"3","person":"","reserved":true},
//       {"timestamp":14506889330,"position":"2015_12_23_0830","place":"P1B","hour":"1","member":"3","person":"","reserved":true}
//     ];

MongoClient.connect("mongodb://" + settings.host + "/" + settings.db, function(err, mongodb) {
  if (err) { return console.dir(err); }
  console.log("Connected correctly to server");
  db = mongodb;  
})

app.get("/reserved", function (req, res) {
    // res.contentType('text');
    // res.header('Access-Control-Allow-Origin', '*');
    try {
      getReserved( function( item ){
        // console.log( item );
        res.send( item );
      });
      // var json = getReserved()
      // console.log( json )
      // res.json( json );
    } catch(e) {
      console.log( '/reserved : error!' )
      res.send([]);
    }
});

app.post("/reserved", function (req, res) {
    console.log( req.body );
    saveReserved( req.body );
    // res.send([]);
});

function getReserved( callback ) {
  db.collection( "reserved", function(err, collection) {
    // collection.insert( test, function(err, result ) {
    //   if (err) { return console.dir(err); }
    //   // console.dir(result);
    // });
    // var stream = collection.find().stream();
    // stream.on( "data", function( item ) {
    //   callback(item);
    // });

    collection.find().toArray(function(err, item) {
      // console.log(item);
      callback(item);
    });

    // collection.remove({});
  })

}

function saveReserved( post ) {
  db.collection( "reserved", function(err, collection) {
    collection.insert( post, function(err, result ) {
      if (err) { return console.dir(err); }
      // console.log(post);
    });
  })
}


console.log( 'start listening at 8000' );
app.listen(8000);