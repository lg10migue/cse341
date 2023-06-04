import { mergeResolvers } from "@graphql-tools/merge" ;
import { userResolvers } from "./userResolvers" ;
import { recipeResolvers } from "./recipeResolvers" ;

const resolvers = mergeResolvers( [ userResolvers, recipeResolvers ] ) ;

export { resolvers } ;