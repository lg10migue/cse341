import { mergeResolvers } from "@graphql-tools/merge" ;
import { userResolvers } from "./userResolvers" ;

const resolvers = mergeResolvers( [ userResolvers ] ) ;

export { resolvers } ;