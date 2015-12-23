var
  db,
  MongoClient = require('mongodb').MongoClient;
  url         = 'mongodb://localhost:27017';

MongoClient.connect( url , function(err, mongodb) {
  if (err) { return console.dir(err); }
  console.log("Connected correctly to server");
  db = mongodb;
})

function getReserved() {
  db.collection( "reserved", function(err, collection) {
    // console.log(collection)
    // collection.insert( test, function(err, result ) {
    //   if (err) { return console.dir(err); }
    //   // console.dir(result);
    // });
    var stream = collection.find().stream();

    stream.on( "data", function( item ) {
      console.log("test")
        console.log(item);
    });
    // collection.find( {name:'fkoji'} ).toArray( function( err , items ){
    //   console.log( items );
    // })
  })
}

module.exports = {
  getReserved : getReserved
}