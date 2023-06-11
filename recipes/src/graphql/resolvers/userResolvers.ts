import { ObjectId } from "mongodb" ;
import * as mongodb from "../../db/connection" ;
import { GraphQLError } from "graphql" ;
import { checkEmail, checkId, checkAuthentication } from "../../utils/validation" ;

const usersCollection = () => {
    return mongodb.getDb().collection( "users" ) ;
} ;

const userResolvers = {
    Query: {
        getUser: async ( _: any, args: any, context: any ) => {
            checkAuthentication( context ) ;
            const userId = context.getUser()._id ;
            checkId( userId ) ;
            try {
                const user = await usersCollection().findOne( { _id: new ObjectId( userId ) } ) ;
                return user ;
            } catch ( error ) {
                throw new GraphQLError( "An error occurs, please try again." ) ;
            } ;
        },
        getAllUsers: async ( _: any, args: any, context: any ) => {
            checkAuthentication( context ) ;
            if ( context.getUser().githubId !== "97310991" ) {
                throw new GraphQLError( "You don't have permissions to see this!" ) ;
            } ;
            try {
                return await usersCollection().find().toArray() ;
            } catch ( error ) {
                throw new GraphQLError( "Cannot find users!" ) ;
            } ;
            
        }
    },
    Mutation: {
        updateUser: async ( _: any, args: any, context: any ) => {
            checkAuthentication( context ) ;
            let userId = context.getUser()._id ;
            checkId( userId ) ;
            userId = new ObjectId( userId ) ;
            const collectionFields = [ "name", "preferredName", "username", "company", "email", "biography" ] ;
            const user: any = {} ;
            for ( const field of collectionFields ) {
                if ( args[ field ] ) {
                    user[ field ] = args[ field ] ;
                } ;
            } ;
            if ( "email" in user ) {
                await checkEmail( user["email"], usersCollection ) ;
            } ;
            if ( Object.keys( user ).length === 0 ) {
                throw new GraphQLError( "No valid fields provided for the update!", { extensions: { code: "BAD_USER_INPUT" } } ) ;
            } ;
            const result = await usersCollection().updateOne( { _id: userId }, { $set: user } ) ;
            if ( result.modifiedCount > 0 ) {
                return await usersCollection().findOne( { _id: userId } ) ;
            } else {
                throw new GraphQLError( "User not found, please check your userId!", { extensions: { code: "BAD_USER_INPUT" } } ) ;
            } ;
        },
        deleteUser: async ( _: any, args: any, context: any ) => {
            checkAuthentication( context ) ;
            const userId = context.getUser()._id ;
            checkId( userId ) ;
            const result = await usersCollection().deleteOne( { _id: new ObjectId( userId ) } ) ;
            if ( result.deletedCount > 0 ) {
                return userId ;
            } else {
                throw new GraphQLError( "User not found, please check your userId!", { extensions: { code: "BAD_USER_INPUT" } } ) ;
            } ;
        }
    }
} ;

export { userResolvers } ;