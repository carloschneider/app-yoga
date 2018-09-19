import { GraphQLServer } from 'graphql-yoga'
import 'module-alias/register'
import 'colors'

import database from '@config/database'
import typeDefs from '@typeDefs/.'
import resolvers from '@resolvers/.'
import { midlewarePersmission } from '@helpers/permissions'

database()

const server = new GraphQLServer({
  typeDefs,
  resolvers,
  context: req => ({ ...req }),
  middlewares: [ midlewarePersmission ]
})

const options = { port: process.env.PORT || 4000 }

server.start(options, () =>
  console.log(`Server is running ⚡ on localhost:${options.port}`.blue))
  .catch(error => console.error('Connection error:', error))
