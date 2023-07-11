import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from "./schema.js";
import db from "./_db.js";


const resolvers = {
    Query: {
        games: () => db.games,
        reviews: () => db.reviews,
        authors: () => db.authors,
        review: (_, args) => db.reviews.find((review) => review.id === args.id),
        game: (_, args) => db.games.find((game) => game.id === args.id),
        author: (_, args) => db.authors.find((author) => author.id === args.id)
    },
    Game: {
        reviews: (parent) => db.reviews.filter((review) => review.game_id == parent.id)
    },
    Author: {
        reviews: (parent) => db.reviews.filter((review) => review.author_id == parent.id)
    },
    Review: {
        author: (parent) => db.authors.find((author) => author.id === parent.author_id),
        game: (parent) => db.games.find((game) => game.id === parent.game_id),
    },
    Mutation: {
        deleteGame: (_, args) => db.games.filter((game) => game.id != args.id),
        addGame: (_, args) => {
            let game = { id: Math.floor(Math.random() * 10000), ...args.game }
            db.games.push(game)
            return game;
        },
        updateGame: (_, args) => {
            db.games = db.games.map((game) => {
                if (game.id == args.id) {
                    return { ...game, ...args.edits }
                }
                return game;
            });

            return db.games.find((game) => game.id == args.id);
        }
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers

});

const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 }
})

console.log("Server ready at port 4000");