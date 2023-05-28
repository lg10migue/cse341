import { ObjectId } from "mongodb" ;
import * as mongodb from "../../db/connection" ;
import validator from "validator" ;
import { GraphQLError } from "graphql" ;

const userResolvers = {
    Query: {
        user: async ( _: any, { userId }: any ) => {
            if ( !ObjectId.isValid( userId ) ) {
                throw new GraphQLError( "Please use a valid user id!", { extensions: { code: "BAD_USER_INPUT" } } )
            } ;
            try {
                const user = await mongodb.getDb().collection( "users" ).findOne( { _id: new ObjectId( userId ) } ) ;
                return user ;
            } catch ( error ) {
                throw new GraphQLError( "An error occurs, please try again." ) ;
            } ;
        },
        getAllUsers: async () => {
            try {
                const users = await mongodb.getDb().collection( "users" ).find().toArray() ;
                return users ;
            } catch ( error ) {
                throw new GraphQLError( "Cannot find users!" ) ;
            } ;
        }
    },
    Mutation: {
        newUser: async ( _: any, { firstName, lastName, username, email, birthday, password }: any ) => {
            if ( !firstName || !lastName || !username || !email || !birthday || !password ) {
                throw new GraphQLError( "All fields are required!", { extensions: { code: "BAD_USER_INPUT" } } ) ;
            } ;

            if ( !validator.isEmail( email ) ) {
                throw new GraphQLError( "Invalid email!", { extensions: { code: "BAD_USER_INPUT" } } ) ;
            } ;

            const usersCollection = mongodb.getDb().collection( "users" ) ;
            const existingUser = await usersCollection.findOne( { email } ) ;
            if ( existingUser ) {
                throw new GraphQLError( "User already exists!", { extensions: { code: "BAD_USER_INPUT" } } ) ;
            } ;

            const newUser = { firstName, lastName, username, email, birthday, password } ;
            try {
                const result = await usersCollection.insertOne( newUser ) ;
                return result.insertedId.toString() ;
            } catch ( error ) {
                throw new GraphQLError( "Failed to create user!" ) ;
            } ;
        },
        updateUser: async ( _: any, args: any ) => {
            if ( !ObjectId.isValid( args.userId ) ) {
                throw new GraphQLError( "Please use a valid user id!", { extensions: { code: "BAD_USER_INPUT" } } )
            } ;
            const userId = new ObjectId( args.userId ) ;
            const collectionFields = [ "firstName", "lastName", "username", "email", "birthday", "password" ] ;
            const user: any = {} ;
            for ( const field of collectionFields ) {
                if ( args[ field ] ) {
                    user[ field ] = args[ field ] ;
                } ;
            } ;
            if ( Object.keys( user ).length === 0 ) {
                throw new GraphQLError( "No valid fields provided for the update!", { extensions: { code: "BAD_USER_INPUT" } } ) ;
            } ;
            const usersCollection = mongodb.getDb().collection( "users" ) ;
            const result = await usersCollection.updateOne( { _id: userId }, { $set: user } ) ;
            if ( result.modifiedCount > 0 ) {
                return await usersCollection.findOne( { _id: userId } ) ;
            } else {
                throw new GraphQLError( "Contact not found, please check your userId!", { extensions: { code: "BAD_USER_INPUT" } } ) ;
            } ;
        },
        deleteUser: async ( _: any, { userId }: any ) => {
            if ( !ObjectId.isValid( userId ) ) {
                throw new GraphQLError( "Please use a valid user id!", { extensions: { code: "BAD_USER_INPUT" } } )
            } ;
            const result = await mongodb.getDb().collection( "users" ).deleteOne( { _id: new ObjectId( userId ) } ) ;
            if ( result.deletedCount > 0 ) {
                return userId
            } else {
                throw new GraphQLError( "Contact not found, please check your userId!", { extensions: { code: "BAD_USER_INPUT" } } ) ;
            } ;
        }
    }
} ;

export { userResolvers } ;