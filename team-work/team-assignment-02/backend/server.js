const express = require( "express" ) ;
const professionalRoutes = require( "./routes/professional" )
const app = express() ;
const port = process.env.PORT || 8080 ;

// Stretch Challenge.
const mongodb = require( "./db/connection" ) ;

app
    .use( ( req, res, next ) => {
        res.setHeader( "Access-Control-Allow-Origin", "*" ) ;
        next() ;
    } )
    .use( "/professional", professionalRoutes ) ;

mongodb.initDb( ( err, mongodb ) => {
    if ( err ) {
        console.log( err ) ;
    } else {
        app.listen( port ) ;
        console.log( `Connected to DB and listening on ${port}` ) ;
    } ;
} ) ;