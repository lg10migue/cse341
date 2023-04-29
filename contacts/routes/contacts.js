const routes = require( "express" ).Router() ;
const contactsController = require( "../controllers/contacts" ) ;

routes.get( "/", contactsController.getContacts ) ;

routes.get( "/:id", contactsController.getContactById ) ;

module.exports = routes ;