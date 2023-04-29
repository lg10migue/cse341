const express = require( "express" ) ;
const app = express() ;
const routes = require( "./routes" ) ;
const mongodb = require( "./db/connection" ) ;
const port = process.env.PORT || 8080 ;

app.use( "/", routes ) ;

mongodb.initDb( ( err, mongodb ) => {
    if ( err ) {
        console.log( err ) ;
    } else {
        app.listen( port ) ;
        console.log( `Web Server is listening at port: ${port}` ) ;
    } ;
} ) ;