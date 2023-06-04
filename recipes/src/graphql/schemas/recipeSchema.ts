import { buildSchema } from "graphql" ;

const recipeSchema = buildSchema( `
    type Recipe {
        _id: ID!
        title: String!
        ingredients: [String!]!
        steps: [String!]!
        prepTime: String!
        cookTime: String!
        userId: String!
    }

    type Query {
        recipe( recipeId: ID! ): Recipe!
        getAllRecipes: [Recipe!]!
    }

    type Mutation {
        newRecipe( title: String!, ingredients: [String!]!, steps: [String!]!, prepTime: String!, cookTime: String!, userId: String! ): ID!
        updateRecipe( recipeId: String!, title: String, ingredients: [String!], steps: [String!], prepTime: String, cookTime: String, userId: String ): Recipe!
        deleteRecipe( recipeId: String! ): ID!
    }
` ) ;

export { recipeSchema } ;