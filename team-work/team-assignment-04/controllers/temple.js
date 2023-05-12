const db = require( "../models" ) ;
const Temple = db.temples ;

const apiKey = "Ezl0961tEpx2UxTZ5v2uKFK91qdNAr5npRlMT1zLcE3Mg68Xwaj3N8Dyp1R8IvFenrVwHRllOUxF0Og00l0m9NcaYMtH6Bpgdv7N" ;

// Function to create a new Temple in MongoDB.
exports.create = ( req, res ) => {

    // #swagger.description = "Create a new Temple in database."

    // Validate request.
    if ( ! req.body.name ) {
        res.status( 400 ).json( "Content can not be empty!" ) ;
        return ;
    } ;

    // Create a Temple.
    const temple = new Temple( {
        temple_id: req.body.temple_id,
        name: req.body.name,
        description: req.body.description,
        location: req.body.location,
    } ) ;

    // Save Temple in the database.
    temple
        .save( temple )
        .then( ( data ) => {
            res.send( data ) ;
        } )
        .catch( ( err ) => {
            res.status( 500 ).json( "Some error occurred while creating the Temple." ) ;
        } ) ;
} ;

// Function to get all Temples from MongoDB.
exports.findAll = ( req, res ) => {

    // #swagger.description = "Get all Temples from database."
    // #swagger.parameters["apiKey"] = { in: "header", schema: "Ezl0961tEpx2UxTZ5v2uKFK91qdNAr5npRlMT1zLcE3Mg68Xwaj3N8Dyp1R8IvFenrVwHRllOUxF0Og00l0m9NcaYMtH6Bpgdv7N" }
    console.log( req.header( "apiKey" ) ) ;
    if ( req.header( "apiKey" ) === apiKey ) {
        Temple.find(
        {},
        {
            temple_id: 1,
            name: 1,
            location: 1,
            dedicated: 1,
            additionalInfo: 1,
            _id: 0,
        }
        )
        .then( ( data ) => {
            res.send( data ) ;
        } )
        .catch( ( err ) => {
            res.status( 500 ).json( "Some error occurred while retrieving temples." ) ;
        } ) ;
    } else {
        res.json( "Invalid apiKey, please read the documentation." ) ;
    } ;
};

// Find a single Temple with an id.
exports.findOne = ( req, res ) => {

    // #swagger.description = "Get a Temple by id."
    // #swagger.parameters["apiKey"] = { in: "header", schema: "Ezl0961tEpx2UxTZ5v2uKFK91qdNAr5npRlMT1zLcE3Mg68Xwaj3N8Dyp1R8IvFenrVwHRllOUxF0Og00l0m9NcaYMtH6Bpgdv7N" }
    const temple_id = req.params.temple_id ;
    if ( req.header( "apiKey" ) === apiKey ) {
        Temple.find( { temple_id: temple_id } )
            .then( ( data ) => {
                if ( data.length === 0 ) res.status( 404 ).json( "Not found Temple with id " + temple_id ) ;
                else res.send( data[0] ) ;
            } )
            .catch( ( err ) => {
                res.status( 500 ).json( "Error retrieving Temple with temple_id=" + temple_id ) ;
            } ) ;
    } else {
        res.json( "Invalid apiKey, please read the documentation." ) ;
    } ;
} ;

// Update a Temple by the id.
exports.update = ( req, res ) => {

    // #swagger.description = "Update a Temple by id in database."
    if ( ! req.body ) {
        return res.status( 400 ).json( "Data to update can not be empty!" ) ;
    } ;

    const id = req.params.id ;
    const temple = {
        name: req.body.name,
        description: req.body.description,
        location: req.body.location,
    } ;

    Temple.findByIdAndUpdate( id, temple, { useFindAndModify: false } )
        .then( ( data ) => {
            if ( ! data ) {
                res.status( 404 ).json( `Cannot update Temple with id=${id}. Maybe Temple was not found!` ) ;
            } else res.json( "Temple was updated successfully." ) ;
        } )
        .catch( ( err ) => {
            res.status( 500 ).json( "Error updating Temple with id=" + id ) ;
        } ) ;
} ;

// Delete a Temple with the specified id.
exports.delete = ( req, res ) => {

    // #swagger.description = "Delete a Temple by id."
    const id = req.params.id ;

    Temple.findByIdAndRemove( id )
        .then( ( data ) => {
            if ( ! data ) {
                res.status( 404 ).json( `Cannot delete Temple with id=${id}. Maybe Temple was not found!` ) ;
            } else {
                res.json( "Temple was deleted successfully!" ) ;
            } ;
        } )
        .catch( ( err ) => {
            res.status( 500 ).json( "Could not delete Temple with id=" + id ) ;
        } ) ;
} ;

// Delete all Temples from the database.
exports.deleteAll = ( req, res ) => {

    // #swagger.description = "WARNING! This will erase all the Temples in database."
    Temple.deleteMany( {} )
        .then( ( data ) => {
            res.json( `${data.deletedCount} Temples were deleted successfully!` ) ;
        } )
        .catch( ( err ) => {
            res.status( 500 ).json( err.message || "Some error occurred while removing all temple." ) ;
        } ) ;
} ;

// Find all dedicated Temples.
exports.findAllAnnounced = ( req, res ) => {

    // #swagger.description = "Get all the announced Temples in database."
    Temple.find( { dedicated: "Announced" } )
        .then( ( data ) => {
            res.json( data ) ;
        } )
        .catch( ( err ) => {
            res.status( 500 ).json( err.message || "Some error occurred while retrieving temple." ) ;
        } ) ;
} ;