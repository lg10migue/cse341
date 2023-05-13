const routes = require( "express" ).Router() ;
const controller = require( "../controllers/" ) ;
const contactsRoutes = require( "./contacts" ) ;
const docRoutes = require( "./doc" ) ;

routes.use( "/", docRoutes ) ;
routes.get( "/", controller.getRandomHero /* #swagger.ignore = true */ ) ;
routes.use( "/contacts", contactsRoutes ) ;

module.exports = routes ;