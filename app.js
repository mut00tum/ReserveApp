const
  express = require( 'express' );

const app = express();
app.use(express.static( "build" ));
app.listen(process.env.PORT || 8000);
console.log( "start listening at 8000" );