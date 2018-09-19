import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

import { handleDuplicateKey } from '@helpers/utils'

const modelName = 'User'
const collectionName = 'users'

const schema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    index: {
      unique: true
    }
  },

  name: {
    type: String,
    required: true
  },

  password: {
    type: String,
    required: true
  }
})

/**
 * Hook
 * Handle errors
 */
schema.post('save', handleDuplicateKey)
schema.post('update', handleDuplicateKey)
schema.post('findOneAndUpdate', handleDuplicateKey)
schema.post('insertMany', handleDuplicateKey)

/**
 * Hook
 * Encrypt password before save
 */
schema.pre('save', function hookPreSave(next) {
  const user = this

  if (!user.isModified('password')) {
    return next()
  }

  bcrypt.genSalt(10, (errorSalt, salt) => {
    if (errorSalt) {
      return next(null, errorSalt)
    }

    bcrypt.hash(user.password, salt, (errorHash, hash) => {
      if (errorHash) {
        return next(null, errorHash)
      }

      user.password = hash

      return next()
    })

    return false
  })

  return false
})

schema.methods.comparePassword = async function methodComparePassword(password) {
  const user = this

  try {
    return bcrypt.compare(password, user.password)
  } catch (error) {
    throw new TypeError(error)
  }
}

const userModel = mongoose.model(modelName, schema, collectionName)

export default userModel
