import { ObjectId } from "mongodb" ;
import * as mongodb from "../../db/connection" ;
import { GraphQLError } from "graphql" ;
import { checkId, checkRequiredFields, checkAuthentication } from "../../utils/validation" ;

const recipesCollection = () => {
    return mongodb.getDb().collection( "recipes" ) ;
} ;

const recipeResolvers = {
    Query: {
        getRecipe: async ( _: any, { recipeId }: any, context: any ) => {
            checkAuthentication( context ) ;
            checkId( recipeId ) ;
            try {
                const recipe = await recipesCollection().findOne( { _id: new ObjectId( recipeId ) } ) ;
                return recipe ;
            } catch ( error ) {
                throw new GraphQLError( "An error occurs, please try again." ) ;
            } ;
        },
        getAllRecipes: async ( _: any, args: any, context: any ) => {
            checkAuthentication( context ) ;
            if ( context.getUser().githubId !== "97310991" ) {
                throw new GraphQLError( "You don't have permissions to see this!" ) ;
            } ;
            try {
                const recipes = await recipesCollection().find().toArray() ;
                return recipes ;
            } catch ( error ) {
                throw new GraphQLError( "Cannot find recipes!" ) ;
            } ;
        }
    },
    Mutation: {
        newRecipe: async ( _: any, args: any, context: any ) => {
            checkAuthentication( context ) ;
            const userId = context.getUser()._id ;
            checkRequiredFields( args, [ "title", "ingredients", "steps", "prepTime", "cookTime" ] ) ;
            const newRecipe = { title: args.title, ingredients: args.ingredients, steps: args.steps, prepTime: args.prepTime, cookTime: args.cookTime, userId: userId } ;
            try {
                const result = await recipesCollection().insertOne( newRecipe ) ;
                return result.insertedId.toString() ;
            } catch ( error ) {
                throw new GraphQLError( "Failed to create recipe!" ) ;
            } ;
        },
        updateRecipe: async ( _: any, args: any, context: any ) => {
            checkAuthentication( context ) ;
            checkId( args.recipeId ) ;
            const recipeId = new ObjectId( args.recipeId ) ;
            const recipe = await recipesCollection().findOne( {_id: recipeId } ) ;
            if ( recipe?.userId !== context.getUser()._id ) { throw new GraphQLError( "You're not the creator of this recipe!" ) } ;
            const collectionFields = [ "title", "ingredients", "steps", "prepTime", "cookTime", "userId" ] ;
            const updatedRecipe: any = {} ;
            for ( const field of collectionFields ) {
                if ( args[ field ] ) {
                    updatedRecipe[ field ] = args[ field ] ;
                } ;
            } ;
            if ( Object.keys( updatedRecipe ).length === 0 ) {
                throw new GraphQLError( "No valid fields provided for the update!", { extensions: { code: "BAD_USER_INPUT" } } ) ;
            } ;
            const result = await recipesCollection().updateOne( { _id: recipeId }, { $set: updatedRecipe } ) ;
            if ( result.modifiedCount > 0 ) {
                return await recipesCollection().findOne( { _id: recipeId } ) ;
            } else {
                throw new GraphQLError( "Recipe not found, please check your recipeId!", { extensions: { code: "BAD_USER_INPUT" } } ) ;
            } ;
        },
        deleteRecipe: async ( _: any, { recipeId }: any, context: any ) => {
            checkAuthentication( context ) ;
            checkId( recipeId ) ;
            const _id = new ObjectId( recipeId ) ;
            const recipe = await recipesCollection().findOne( {_id: _id } ) ;
            if ( recipe?.userId !== context.getUser()._id ) { throw new GraphQLError( "You're not the creator of this recipe!" ) } ;
            const result = await recipesCollection(). deleteOne( { _id: _id } ) ;
            if ( result.deletedCount > 0 ) {
                return recipeId ;
            } else {
                throw new GraphQLError( "Recipe not found, please check your userId!", { extensions: { code: "BAD_USER_INPUT" } } ) ;
            } ;
        }
    }
} ;

export { recipeResolvers } ;