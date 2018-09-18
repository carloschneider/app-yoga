import jwt from 'jsonwebtoken'

import secret from '@config/secret'

const handleDuplicateKey = (error, doc, next) => {
  if (error.name === 'MongoError' && error.code === 11000) {
    const [ , field, value ] = /\.\$([a-zA-Z]+).*"(.*)"/gi.exec(error.errmsg)

    next(new TypeError(`The ${field} ${value} already exists`))
  }

  next(error)
}

const getIdByJwt = authorization => {
  const [ type, token ] = authorization.split(' ')

  if (type !== 'Bearer') {
    throw new TypeError('Wrong authorization type')
  }

  if (token.length === 0) {
    throw new TypeError('Token empty')
  }

  const { id: _id } = jwt.verify(token, secret)

  return _id
}

export {
  handleDuplicateKey,
  getIdByJwt
}
