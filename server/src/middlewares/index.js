/* eslint-disable no-undef */
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

function auth(req, res, next) {
  const token = req.header('auth-token')
  const jwtToken = process.env.TOKEN_SECRET
  if (!token)
    return res.status(401).json({
      message: 'No token, authorization denied',
    })

  try {
    jwt.verify(token, jwtToken, (error, decoded) => {
      if (error) {
        return res.status(401).json({ msg: 'Token is not valid' })
      } else {
        req.user = decoded.user
        console.log(req.user)
        next()
      }
    })
  } catch (error) {
    console.error('something wrong with auth middleware')
    res.status(500).json({
      msg: 'Server error',
    })
  }
}

const checkObjectId = idToCheck => (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params[idToCheck]))
    return res.status(400).json({ msg: 'Invalid ID' })
  next()
}

function notFound(req, res, next) {
  res.status(404)
  const error = new Error(`🔍 - Not Found - ${req.originalUrl}`)
  next(error)
}

/* eslint-disable no-unused-vars */
function errorHandler(err, req, res, next) {
  /* eslint-enable no-unused-vars */
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500
  res.status(statusCode)
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  })
}

module.exports = {
  notFound,
  errorHandler,
  auth,
  checkObjectId,
}
