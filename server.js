"use strict";

const
  express     = require( 'express' ),
  bodyParser  = require( 'body-parser' ),
  co          = require( 'co' ),
  MongoClient = require( 'mongodb' ).MongoClient,
  settings    = require( './settings' );

var
  db , myCollection;

const app    = express();
const server = require( 'http' ).Server(app);

app.use(express.static( 'build' ));
app.use(bodyParser.json());

console.log( 'start listening at 8000' );
app.listen( settings.port );

MongoClient.connect("mongodb://" + settings.host + "/" + settings.db, function(err, mongodb) {
  if (err) { return console.dir(err); }
  console.log("Connected correctly to server");
  db           = mongodb;
  myCollection = db.collection( 'reserved' )
})

// getReserved
// ---------------------------------------------------
app.get("/getReserved", function (req, res) {
  const
    query  = req.query,
    monday = query['monday'];
    loading( monday , res );
});

var loading = ( monday , res) => {
  var
    list     = [],
    findList = [];

  var getDateList = () => {
    for ( let i = 0; i < 7; i++ ) {
      const arr  = monday.split( '_' );
      const date =  arr[0] + '_' + arr[1] + '_' + String( Number(arr[2]) + i );
      list.push( {date:date} );
    }
  }
  var matchCollection = () => {
    myCollection.find(
      { $or:list }
    ).toArray( function( err, item ) {
      if (err) { return console.log(err); }
      res.send( item );
    });
  }
  co( function*(){
    getDateList();
    matchCollection();
  });
}

// save
// ---------------------------------------------------
app.post("/save", function (req, res) {
  try {
    save( req.body , res );

  } catch(e) {
    console.log( 'save : error!' )
  }
});

var save = ( data , res ) => {
  const
    position = data.position.split( '/' ),
    list     = [];
  myCollection.insert( data, function( err, result ) {
    if (err) { return console.log(err); }
    res.status(200).end();
  });
}


// cancel
// ---------------------------------------------------
app.post("/cancel", function (req, res) {
  try {
    cancel( req, res );
    res.status(200).end();
  } catch(e) {
    console.log( 'POST : error!' );
    console.log( e )
  }
});

var cancel = ( req ) => {
  const data = req.body;
  data.forEach( function( list ){
    myCollection.remove( { timestamp: list.timestamp } ,
      function( err, result ) {
        if (err) { return console.log(err); }
      }
    )
  })
}


// cancel
// ---------------------------------------------------
app.get("/reset", function (req, res){
  console.log( "MongoDB / reserved : clear!!" );
  myCollection.remove();
});

