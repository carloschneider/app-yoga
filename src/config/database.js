import mongoose from 'mongoose'

export default () => {
  const user = process.env.DATABASE_USER || 'graphql'
  const pass = process.env.DATABASE_PASS || 'graphql'
  const host = process.env.DATABASE_HOST || 'localhost'
  const port = process.env.DATABASE_PORT || 27017
  const db = process.env.DATABASE_DB || 'graphql'

  mongoose.connect(`mongodb://${user}:${pass}@${host}:${port}/${db}`, { useNewUrlParser: true })
  mongoose.set('useCreateIndex', true)

  const connect = mongoose.connection

  connect.on('error', error => {
    console.log(`${error}`.red)
  })

  connect.on('connected', () => {
    console.log('MongoDB ⚡ connected'.blue)
  })

  connect.on('disconnected', () => {
    console.warn('MongoDB disconnected'.red)
  })

  return db
}
