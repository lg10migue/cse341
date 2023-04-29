const mongodb = require( "../db/connection" ) ;
const { ObjectId } = require( "mongodb" ) ;

const getContacts = async ( request, response, next ) => {
    const contacts = await mongodb.getDb().db().collection( "contacts" ).find().toArray() ;
    response.status( 200 ).json( contacts ) ;
} ;

const getContactById = async ( req, res, next ) => {
    const userId = new ObjectId( req.params.id ) ;
    const contact = await mongodb.getDb().db().collection( "contacts" ).findOne( { _id : userId } ) ;
    res.status( 200 ).json( contact ) ;
} ;

module.exports = { getContacts, getContactById } ;