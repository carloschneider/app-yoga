import { getIdByJwt } from '@helpers/utils'

const isLoggedIn = async (next, _, args, context, { fieldName }) => {
  const resolvers = [
    'authUser',
    'createUser'
  ]

  if (resolvers.includes(fieldName)) {
    return next()
  }

  context.request.headers._id = getIdByJwt(context.request.get('authorization'))

  return next()
}

const midlewarePersmission = {
  Query: isLoggedIn,
  Mutation: isLoggedIn
}

export {
  midlewarePersmission
}
