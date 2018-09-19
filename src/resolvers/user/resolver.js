import jwt from 'jsonwebtoken'

import UsersModel from './model'
import secret from '@config/secret'
import { getIdByJwt } from '@helpers/utils'

export default {
  Query: {
    profile: async (_, args, context) => {
      const _id = context.request.get('_id')

      const user = await UsersModel.findOne({
        _id
      }).exec()

      return user
    },

    authUser: async (_, { email, password }) => {
      const user = await UsersModel.findOne({
        email
      }, 'password').exec()

      if (user === null) {
        throw new TypeError('User not found')
      }

      const comparePassword = await user.comparePassword(password)

      if (comparePassword === true) {
        const token = jwt.sign({ id: user._id }, secret, { expiresIn: '30 days' })

        return {
          token
        }
      }

      throw new TypeError('Invalid password')
    }
  },

  Mutation: {
    createUser: async (_, { input }) => {
      const User = new UsersModel(input)

      return User.save()
    }
  }
}