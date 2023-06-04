import { mergeTypeDefs } from "@graphql-tools/merge" ;
import { userSchema } from "./userSchema" ;
import { recipeSchema } from "./recipeSchema" ;

const typeDefs = mergeTypeDefs( [ userSchema, recipeSchema ] ) ;

export { typeDefs } ;