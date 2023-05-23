import { buildSchema } from "graphql" ;

const userSchema = buildSchema( `
    type User {
        _id: ID!
        firstName: String!
        lastName: String!
        email: String!
        birthday: String!
        password: String!
    }

    type Query {
        user( id: ID! ): User
        getAllUsers: [User!]!
    }

    type Mutation {
        newUser( firstName: String!, lastName: String!, email: String!, birthday: String!, password: String! ): User!
    }
` )

export { userSchema } ;