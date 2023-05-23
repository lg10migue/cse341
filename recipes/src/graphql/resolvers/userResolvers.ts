import { ObjectId } from "mongodb" ;
import * as mongodb from "../../db/connection" ;

const userResolvers = {
    Query: {
        user: async ( _:any, args: any ) => {
            const id = args.id
            try {
                const user = await mongodb.getDb().collection( "users" ).findOne( { _id: new ObjectId( id ) } ) ;
                return user ;
            } catch ( error ) {
                throw new Error( "Cannot find the user!" ) ;
            } ;
        },
        getAllUsers: async () => {
            try {
                const users = await mongodb.getDb().collection( "users" ).find().toArray() ;
                return users ;
            } catch ( error ) {
                throw new Error( "Cannot find users!" ) ;
            } ;
        }
    },
    Mutation: {
        newUser: async ( _:any, args: any ) => {
            const newUser = { firstName: args.firstName, lastName: args.lastName, email: args.email, birthday: args.birthday, password: args.password } ;
            try {
                const result = await mongodb.getDb().collection( "users" ).insertOne( newUser ) ;
                return { _id: result.insertedId.toString() } ;
            } catch ( error ) {
                throw new Error( "Failed to create user!" ) ;
            } ;
        }
    }
} ;

export { userResolvers } ;