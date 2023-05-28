import { ObjectId } from "mongodb" ;
import * as mongodb from "../../db/connection" ;
import { GraphQLError } from "graphql" ;
import { checkEmail, checkId, checkRequiredFields } from "../../utils/validation" ;

const usersCollection = () => {
    return mongodb.getDb().collection( "users" ) ;
} ;

const userResolvers = {
    Query: {
        user: async ( _: any, { userId }: any ) => {
            checkId( userId ) ;
            try {
                const user = await usersCollection().findOne( { _id: new ObjectId( userId ) } ) ;
                return user ;
            } catch ( error ) {
                throw new GraphQLError( "An error occurs, please try again." ) ;
            } ;
        },
        getAllUsers: async () => {
            try {
                const users = await usersCollection().find().toArray() ;
                return users ;
            } catch ( error ) {
                throw new GraphQLError( "Cannot find users!" ) ;
            } ;
        }
    },
    Mutation: {
        newUser: async ( _: any, args: any ) => {
            checkRequiredFields( args, [ "firstName", "lastName", "username", "email", "birthday", "password" ] ) ;
            await checkEmail( args.email, usersCollection ) ;
            const newUser = { firstName: args.firstName, lastName: args.lastName, username: args.username, email: args.email, birthday: args.birthday, password: args.password } ;
            try {
                const result = await usersCollection().insertOne( newUser ) ;
                return result.insertedId.toString() ;
            } catch ( error ) {
                throw new GraphQLError( "Failed to create user!" ) ;
            } ;
        },
        updateUser: async ( _: any, args: any ) => {
            checkId( args.userId ) ;
            const userId = new ObjectId( args.userId ) ;
            const collectionFields = [ "firstName", "lastName", "username", "email", "birthday", "password" ] ;
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
                throw new GraphQLError( "Contact not found, please check your userId!", { extensions: { code: "BAD_USER_INPUT" } } ) ;
            } ;
        },
        deleteUser: async ( _: any, { userId }: any ) => {
            checkId( userId ) ;
            const result = await usersCollection().deleteOne( { _id: new ObjectId( userId ) } ) ;
            if ( result.deletedCount > 0 ) {
                return userId
            } else {
                throw new GraphQLError( "Contact not found, please check your userId!", { extensions: { code: "BAD_USER_INPUT" } } ) ;
            } ;
        }
    }
} ;

export { userResolvers } ;