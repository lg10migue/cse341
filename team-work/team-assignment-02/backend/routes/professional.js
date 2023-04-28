const routes = require( "express" ).Router() ;
const professionalController = require( "../controllers/professional" ) ;

// routes.get( "/", professionalController.getData ) ;

// Route for Stretch Challenge.
routes.get( "/", professionalController.getDBData ) ;

module.exports = routes ;