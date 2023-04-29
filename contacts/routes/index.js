const routes = require( "express" ).Router() ;
const controller = require( "../controllers/" ) ;
const contactsRoutes = require( "./contacts" ) ;

routes.get( "/", controller.getRandomHero ) ;
routes.use( "/contacts", contactsRoutes ) ;

module.exports = routes ;