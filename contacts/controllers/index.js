const getRandomHero = ( req, res, next ) => {
    const heroes = [ "Thor", "Iron-Man", "Hulk", "Scarlet Witch", "Captain America", "Spider-Man", "Superman", "Batman", "Flash" ] ;
    const randomIndex = Math.floor( Math.random() * heroes.length ) ;
    res.send( heroes[randomIndex] ) ;
} ;

module.exports = { getRandomHero } ;