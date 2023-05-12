const routes = require( "express" ).Router() ;
const temples = require( "../controllers/temple.js" ) ;

routes.get( "/find-announced/", temples.findAllAnnounced ) ;
routes.get( "/:temple_id", temples.findOne ) ;
routes.get( "/", temples.findAll ) ;
routes.post( "/", temples.create ) ;
routes.put( "/:id", temples.update ) ;
routes.delete( "/delete-all", temples.deleteAll ) ;
routes.delete( "/:id", temples.delete ) ;

module.exports = routes ;