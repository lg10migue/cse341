import { GraphQLError } from "graphql" ;
import { ObjectId } from "mongodb" ;
import validator from "validator" ;

export const checkEmail = async ( email: string, dbCollection: Function ) => {
    if ( !validator.isEmail( email ) ) {
        throw new GraphQLError( "Invalid email!", { extensions: { code: "BAD_USER_INPUT" } } ) ;
    } ;

    const existingUser = await dbCollection().findOne( { email } ) ;
    if ( existingUser ) {
        throw new GraphQLError( "User already exists!", { extensions: { code: "BAD_USER_INPUT" } } ) ;
    } ;
} ;

export const checkId = ( Id: string ) => {
    if ( !ObjectId.isValid( Id ) ) {
        throw new GraphQLError( "Please use a valid id!", { extensions: { code: "BAD_USER_INPUT" } } )
    } ;
} ;

export const checkRequiredFields = ( data: any, fields: string[] = [] ) => {
    for ( const field  of fields ) {
        if ( !data[field] ) {
            throw new GraphQLError( `${field} field is required!`, { extensions: { code: "BAD_USER_INPUT" } } ) ;
        } ;
    } ;
} ;