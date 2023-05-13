const swaggerAutogen = require( "swagger-autogen" )() ;

const doc = {
    info : {
        title : "Contacts API",
        description : "Contacts API for CSE 341 Project 1."
    },
    host : "contacts-project-cse341.onrender.com",
    schemes : [ "https" ]
} ;

const outputFile = "./swagger.json" ;
const endpointFiles = [ "./routes/index.js" ] ;

// Build documentation at project startup.
swaggerAutogen( outputFile, endpointFiles, doc ).then( () => {
    require( "./server.js" ) ;
} ) ;