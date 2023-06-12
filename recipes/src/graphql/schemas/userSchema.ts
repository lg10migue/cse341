import { buildSchema } from "graphql" ;

const userSchema = buildSchema( `
    type User {
        _id: ID!
        githubId: String!
        name: String!
        preferredName: String!
        username: String!
        company: String!
        email: String!
        biography: String!
        accessToken: String
    }

    type Query {
        getUser: User!
        getAllUsers: [User!]!
    }

    type Mutation {
        updateUser( name: String, preferredName: String, username: String, company: String, email: String, biography: String ): User!
        deleteUser: ID!
    }
` ) ;

export { userSchema } ;