import express from "express" ;
import { ApolloServer } from "@apollo/server" ;
import { ApolloServerPluginLandingPageDisabled } from "@apollo/server/plugin/disabled";
import { expressMiddleware } from "@apollo/server/express4" ;
import { initDb } from "./db/connection" ;
import cors from "cors" ;
import { typeDefs } from "./graphql/schemas/schemas"
import { resolvers } from "./graphql/resolvers/resolvers" ;

const port = process.env.PORT || 8080 ;
const app = express();

async function startServer() {
    const server = new ApolloServer( { 
        typeDefs, 
        resolvers,
        plugins: [ ApolloServerPluginLandingPageDisabled() ] 
    } ) ;

    await server.start() ;
    app.use( "/graphql", cors(), express.json(), expressMiddleware( server ) ) ;

    initDb( ( err: Error | null ) => {
        if ( err ) {
            console.error( err ) ;
        } else {
            app.listen( port ) ;
            console.log( `Web Server is listening at http://localhost:${port}/graphql` ) ;
        } ;
    } ) ;
} ;

startServer().catch( ( error ) => {
    console.error( "Error starting the server:", error ) ;
} ) ;