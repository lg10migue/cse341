const routes = require( "express" ).Router() ;
const temple = require( "./temple" ) ;
const docs = require( "./doc" ) ;

routes.use( "/", docs ) ;
routes.use( "/temples", temple ) ;
routes.use(
    "/",
    ( docData = ( req, res ) => {
        let docData = {
            documentationURL: "https://nathanbirch.github.io/nathan-byui-api-docs",
        } ;
        res.send( docData ) ;
    } )
) ;

module.exports = routes ;