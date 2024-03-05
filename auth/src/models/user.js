const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstname: { type: String, required: true, unique: false },
    lastname: { type: String, required: true, unique: false }
  }, { timestamps: true })

const User = mongoose.model('User', UserSchema)

module.exports = User
