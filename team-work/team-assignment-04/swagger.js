const swaggerAutogen = require( "swagger-autogen" )() ;

const doc = {
    info : {
        title : "Temples API",
        description : "Practice of adding documentation to an API."
    },
    host : "localhost:8080",
    schemes : [ "http" ]
} ;

const outputFile = "./swagger.json" ;
const endpointFiles = [ "./routes/index.js" ] ;

// Build documentation at project startup.
swaggerAutogen( outputFile, endpointFiles, doc ).then( () => {
    require( "./index.js" ) ;
} ) ;