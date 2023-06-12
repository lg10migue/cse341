import passport from "passport" ;
import { Strategy as GitHubStrategy } from "passport-github2" ;
import * as mongodb from "../db/connection" ;

const usersCollection = () => {
    return mongodb.getDb().collection( "users" ) ;
} ;

const gitHubOptions = {
    clientID: process.env.CLIENT_ID as string,
    clientSecret: process.env.CLIENT_SECRET as string,
    callbackURL: process.env.CALLBACK_URL as string
} ;

const gitHubCallBack = async ( accessToken: string, refreshToken: string, profile: any, done: any ) => {
    let user = await usersCollection().findOne( { githubId: profile.id } ) ;
    if ( !user ) {
        const newUser = {
            githubId: profile.id,
            name: profile._json.name,
            preferredName: profile.displayName,
            username: profile.username,
            company: profile._json.company,
            email: profile._json.email,
            biography: profile._json.bio,
        } ;
        try {
            const result = await usersCollection().insertOne( newUser ) ;
            user = await usersCollection().findOne( { _id: result.insertedId } ) ;
            return result.insertedId.toString() ;
        } catch ( error ) {
            throw new Error( "Failed to create user!" ) ;
        } ;
    } ;

    return done( null, user ) ;
} ;

passport.use( new GitHubStrategy( gitHubOptions, gitHubCallBack ) ) ;
passport.serializeUser( ( user: any, done ) => done( null, user ) ) ;
passport.deserializeUser( ( user: any, done ) => done( null, user ) ) ;