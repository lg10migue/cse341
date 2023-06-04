import { ObjectId } from "mongodb" ;
import * as mongodb from "../../db/connection" ;
import { GraphQLError } from "graphql" ;
import { checkId, checkRequiredFields } from "../../utils/validation" ;

const recipesCollection = () => {
    return mongodb.getDb().collection( "recipes" ) ;
} ;

const recipeResolvers = {
    Query: {
        recipe: async ( _: any, { recipeId }: any ) => {
            checkId( recipeId ) ;
            try {
                const recipe = await recipesCollection().findOne( { _id: new ObjectId( recipeId ) } ) ;
                return recipe ;
            } catch ( error ) {
                throw new GraphQLError( "An error occurs, please try again." ) ;
            } ;
        },
        getAllRecipes: async () => {
            try {
                const recipes = await recipesCollection().find().toArray() ;
                return recipes ;
            } catch ( error ) {
                throw new GraphQLError( "Cannot find recipes!" ) ;
            } ;
        }
    },
    Mutation: {
        newRecipe: async ( _: any, args: any ) => {
            checkRequiredFields( args, [ "title", "ingredients", "steps", "prepTime", "cookTime", "userId" ] ) ;
            const newRecipe = { title: args.title, ingredients: args.ingredients, steps: args.steps, prepTime: args.prepTime, cookTime: args.cookTime, userId: args.userId } ;
            try {
                console.log( newRecipe ) ;
                const result = await recipesCollection().insertOne( newRecipe ) ;
                return result.insertedId.toString() ;
            } catch ( error ) {
                console.log( error ) ;
                throw new GraphQLError( "Failed to create recipe!" ) ;
            } ;
        },
        updateRecipe: async ( _: any, args: any ) => {
            checkId( args.recipeId ) ;
            const recipeId = new ObjectId( args.recipeId ) ;
            const collectionFields = [ "title", "ingredients", "steps", "prepTime", "cookTime", "userId" ] ;
            const recipe: any = {} ;
            for ( const field of collectionFields ) {
                if ( args[ field ] ) {
                    recipe[ field ] = args[ field ] ;
                } ;
            } ;
            if ( Object.keys( recipe ).length === 0 ) {
                throw new GraphQLError( "No valid fields provided for the update!", { extensions: { code: "BAD_USER_INPUT" } } ) ;
            } ;
            const result = await recipesCollection().updateOne( { _id: recipeId }, { $set: recipe } ) ;
            if ( result.modifiedCount > 0 ) {
                return await recipesCollection().findOne( { _id: recipeId } ) ;
            } else {
                throw new GraphQLError( "Recipe not found, please check your recipeId!", { extensions: { code: "BAD_USER_INPUT" } } ) ;
            } ;
        },
        deleteRecipe: async ( _: any, { recipeId }: any ) => {
            checkId( recipeId ) ;
            const result = await recipesCollection(). deleteOne( { _id: new ObjectId( recipeId ) } ) ;
            if ( result.deletedCount > 0 ) {
                return recipeId ;
            } else {
                throw new GraphQLError( "Recipe not found, please check your userId!", { extensions: { code: "BAD_USER_INPUT" } } ) ;
            } ;
        }
    }
} ;

export { recipeResolvers } ;