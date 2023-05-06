const express = require( "express" ) ;
const routes = require( "./routes" ) ;
const mongodb = require( "./db/connection" ) ;
const port = process.env.PORT || 8080 ;
const app = express() ;

app.use( express.json() ) ;
app.use( "/", routes ) ;

mongodb.initDb( ( err ) => {
    if ( err ) {
        console.log( err ) ;
    } else {
        app.listen( port ) ;
        console.log( `Web Server is listening at port: ${port}` ) ;
    } ;
} ) ;