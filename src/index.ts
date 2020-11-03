import { ApolloServer, makeExecutableSchema, AuthenticationError } from 'apollo-server-express';
import { resolvers } from './resolvers'
import { typeDefs } from './schema.graphql'
import { verifyIdToken } from './firebase';
import * as express from 'express';
import * as http from 'http';
import * as dotenv from 'dotenv';
import * as cors from 'cors';

dotenv.config()
const corsConfig = {
  origin: function (origin, callback) {
    let origins = process.env.ORIGIN_HEADERS.split(", ")
    if (origins.includes(origin)) {
      return origin
    }
  },
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Authorization'],
};

const schema = makeExecutableSchema({ typeDefs, resolvers });
const app = express();
const path = '/graphql';
const port = process.env.PORT || 4000;

const server = new ApolloServer({
  schema,
  engine: {
    apiKey: process.env.APOLLO_API_KEY
  },
  context: ({ req, res }) => {
    // Get the user token from the headers.
    const token = req.headers.authorization || undefined;
    if (token) { 
        return new Promise ((resolve, reject) => {
          verifyIdToken(token.replace(/^Bearer\s/, '').trim()).then(user => {
            resolve({
              user: user
            })
          }).catch(err => {
            reject(err)
          })
      }).catch(err => {
        switch(err.code) {
          case "auth/id-token-expired":
            throw new AuthenticationError("Token has expired")
          case "auth/id-token-revoked":
            throw new AuthenticationError("Token revoked")
          case "auth/argument-error":
            throw new AuthenticationError("Failed to decrypt")
          default:
            throw new AuthenticationError(err.toString())
        }
      })
    }
  },
  introspection: true,
  playground: true,
  debug: true,
});

app.use(cors(corsConfig))
server.applyMiddleware({ app, path, cors: false })

http.createServer(app).listen(port, () => console.info(`🚀  Server ready at http://localhost:${port}${path}`))
