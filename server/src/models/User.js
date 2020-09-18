const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 2,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    min: 6,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  nickname: {
    type: String,
    max: 2,
    required: true,
  },
})

userSchema.pre('validate', function (next) {
  if (this.name) {
    this.nickname = (this.name[0] + this.name[1]).toUpperCase()
  }

  next()
})

const User = mongoose.model('User', userSchema)

module.exports = User
