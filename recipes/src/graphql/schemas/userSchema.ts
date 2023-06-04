import { buildSchema } from "graphql" ;

const userSchema = buildSchema( `
    type User {
        _id: ID!
        firstName: String!
        lastName: String!
        username: String!
        email: String!
        birthday: String!
        password: String!
    }

    type Query {
        user( userId: ID! ): User!
        getAllUsers: [User!]!
    }

    type Mutation {
        newUser( firstName: String!, lastName: String!, username: String!, email: String!, birthday: String!, password: String! ): ID!
        updateUser( userId: String!, firstName: String, lastName: String, username: String, email: String, birthday: String, password: String ): User!
        deleteUser( userId: String! ): ID!
    }
` ) ;

export { userSchema } ;