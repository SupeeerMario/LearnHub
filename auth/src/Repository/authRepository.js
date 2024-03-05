const User = require('../models/user')

class AuthRepository {
  async createUser (userData) {
    const newUser = await User.create(userData)
    return newUser.toObject()
  }

  async findUserById (_id) {
    try {
      const user = await User.findById(_id).lean()
      return user
    } catch (error) {
      throw new Error(`Failed to fetch user: ${error.message}`)
    }
  }

  async findUserByEmail (email) {
    const user = await User.findOne({ email }).lean()
    return user
  }

  async findUserByUsername (username) {
    const user = await User.findOne({ username }).lean()
    return user
  }

  async getAllUsers () {
    try {
      const users = await User.find().lean()
      return users
    } catch (error) {
      throw new Error(`Failed to fetch users: ${error.message}`)
    }
  }
}

module.exports = AuthRepository
