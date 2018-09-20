import jwt from 'jsonwebtoken'

import UsersModel from './model'
import secret from '@config/secret'

export default {
  Query: {
    profile: async (_, args, context) => {
      const _id = context.request.get('_id')
      const query = { _id }

      return UsersModel.findOne(query).exec()
    },

    authUser: async (_, { email, password }) => {
      const query = { email }

      const user = await UsersModel.findOne(query, 'password').exec()

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
    },

    updateUser: async (_, { input }, context) => {
      const _id = context.request.get('_id')
      const query = { _id }
      const update = { $set: input }
      const options = { new: true }

      return UsersModel.findOneAndUpdate(query, update, options).exec()
    }
  }
}
