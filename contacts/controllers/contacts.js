const mongodb = require( "../db/connection" ) ;
const { ObjectId } = require( "mongodb" ) ;

const getContacts = async ( request, response, next ) => {

    // #swagger.tags = [ "Contacts" ]
    // #swagger.description = "Retrieve all contacts from database."
    const contacts = await mongodb.getDb().collection( "contacts" ).find().toArray() ;
    response.status( 200 ).json( contacts ) ;
} ;

const getContactById = async ( request, response ) => {

    // #swagger.tags = [ "Contacts" ]
    // #swagger.description = "Retrieve a single contact by id."
    const userId = new ObjectId( request.params.id ) ;
    const contact = await mongodb.getDb().collection( "contacts" ).findOne( { _id : userId } ) ;
    response.status( 200 ).json( contact ) ;
} ;

const addContact = async ( request, response ) => {

    // #swagger.tags = [ "Contacts" ]
    // #swagger.description = "Create a new contact in database."
    // #swagger.parameters["contact"] = { in: "body", schema: { firstName: "string", lastName: "string", email: "string", favoriteColor: "string", birthday: "D M Y" } }
    const newContact = { firstName, lastName, email, favoriteColor, birthday } = request.body ;
    try {
        const result = await mongodb.getDb().collection( "contacts" ).insertOne( newContact ) ;
        response.status( 201 ).json( result ) ;
    } catch ( error ) {
        response.status( 500 ).json( error.message ) ;
    } ;
} ;

const updateContact = async ( request, response ) => {

    // #swagger.tags = [ "Contacts" ]
    // #swagger.description = "Update a contact in database by id. You can update all the fields or only the necessary ones."
    // #swagger.parameters["contact"] = { in: "body", schema: { firstName: "string", lastName: "string", email: "string", favoriteColor: "string", birthday: "D M Y" } }
    try {
        const userId = new ObjectId( request.params.id ) ;
        const collectionFields = [ "firstName", "lastName", "email", "favoriteColor", "birthday" ] ;
        const contact = {} ;
        for ( const field of collectionFields ) {
            if ( request.body[field] ) {
                contact[field] = request.body[field] ;
            } ;
        } ;
        if ( Object.keys( contact ).length === 0 ) {
            return response.status( 400 ).json( "No valid fields provided for the update." ) ;
        } ;
        const result = await mongodb.getDb().collection( "contacts" ).updateOne( { _id : userId }, { $set : contact } ) ;
        if ( result.modifiedCount > 0 ) {
            response.status( 204 ).send() ;
        } else {
            response.status( 404 ).json( "Contact not found." ) ;
        } ;
    } catch ( error ) {
        response.status( 500 ).json( error.message ) ;
    } ;
} ;

const deleteContact = async ( request, response ) => {

    // #swagger.tags = [ "Contacts" ]
    // #swagger.description = "Delete a contact by id."
    try {
        const userId = new ObjectId( request.params.id ) ;
        const result = await mongodb.getDb().collection( "contacts" ).deleteOne( { _id: userId } ) ;
        if ( result.deletedCount > 0 ) {
            response.status( 200 ).send() ;
        } else {
            response.status( 404 ).json( "Contact not found." ) ;
        } ;
    } catch ( error ) {
        response.status( 500 ).json( error.message ) ;
    } ;
} ;

module.exports = { getContacts, getContactById, addContact, updateContact, deleteContact } ;