import { mergeTypeDefs } from "@graphql-tools/merge" ;
import { userSchema } from "./userSchema" ;

const typeDefs = mergeTypeDefs( [ userSchema ] ) ;

export { typeDefs } ;