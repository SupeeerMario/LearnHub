const bcrypt = require('bcrypt')
const joi = require('joi')
const AuthRepository = require('../Repository/authRepository')
const AuthMiddlewares = require('../middlewares/authMiddlewares')

class AuthService {
  constructor () {
    this.authRepository = new AuthRepository()
  }

  validateUserData (data) {
    const schema = joi.object({
      username: joi.string().required().label('UserName'),
      firstname: joi.string().required().label('First Name'),
      lastname: joi.string().required().label('Last Name'),
      email: joi.string().email().required().label('Email'),
      password: joi.string().required().label('Password')
    })

    return schema.validate(data)
  }

  async registerUser (userData) {
    try {
      const { error } = this.validateUserData(userData)
      if (error) {
        throw new Error(error.details[0].message)
      }

      const salt = await bcrypt.genSalt(Number(process.env.SALT))
      const hashPassword = await bcrypt.hash(userData.password, salt)

      const newUser = await this.authRepository.createUser({
        ...userData,
        password: hashPassword
      })

      return { message: 'User created successfully', user: newUser }
    } catch (error) {
      throw new Error(`Registration failed: ${error.message}`)
    }
  }

  async existingUserEmail (email) {
    const user = await this.authRepository.findUserByEmail(email)
    return !!user
  }

  async existingUserName (username) {
    const user = await this.authRepository.findUserByUsername(username)
    return !!user
  }

  async loginUser (email, password) {
    try {
      const user = await this.authRepository.findUserByEmail(email)

      if (!user) {
        console.log('Email:', email)

        throw new Error('Invalid Email')
      }

      const validPassword = await bcrypt.compare(password, user.password)
      if (!validPassword) {
        console.log('Entered Password:', password)
        console.log('Hashed Password from DB:', user.password)
        console.log('bcrypt.compare Result:', validPassword)
        throw new Error('Invalid Password')
      }

      const token = AuthMiddlewares.tokenassign(user)
      return { message: 'Login successful', success: true, token }
    } catch (error) {
      console.error(`Login failed: ${error.message}`)
      return { message: 'Login not successful', success: false }
    }
  }

  async getUserById (_id) {
    try {
      const user = await this.authRepository.findUserById(_id)
      return user
    } catch (error) {
      throw new Error(`Failed to fetch user: ${error.message}`)
    }
  }

  async getAllUsers () {
    try {
      const users = await this.authRepository.getAllUsers()
      return users
    } catch (error) {
      throw new Error(`Failed to fetch users: ${error.message}`)
    }
  }
}

module.exports = AuthService
