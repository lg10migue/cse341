const routes = require( "express" ).Router() ;
const controller = require( "../controllers/" ) ;

routes.get( "/", controller.getRandomHero ) ;

module.exports = routes ;