const AuthService = require('../Service/service')
const AuthMiddlewares = require('../middlewares/authMiddlewares')
const tenYearsInSeconds = 10 * 365 * 24 * 60 * 60

class AuthController {
  constructor () {
    this.authService = new AuthService()
  }

  async login (req, res) {
    const { email, password } = req.body

    const result = await this.authService.loginUser(email, password)

    if (result.success) {
      res.json({ message: result.message, token: result.token })
    } else {
      res.status(400).json({ message: result.message })
    }
  }

  async register (req, res) {
    const user = req.body

    try {
      const existingUserEmail = await this.authService.existingUserEmail(user.email)
      const existingUserName = await this.authService.existingUserName(user.username)

      if (existingUserEmail) {
        throw new Error('Email already taken')
      }

      if (existingUserName) {
        throw new Error('Username already taken')
      }

      const result = await this.authService.registerUser(user)
      res.json(result)
    } catch (err) {
      res.status(400).json({ message: err.message })
    }
  }

  async getProfile (req, res) {
    try {
      // Call the isAuthenticated middleware
      await AuthMiddlewares.isAuthenticated(req, res, async () => {
        const userId = req.decodedUserId
        const user = await this.authService.getUserById(userId)
        res.json(user)
      })
    } catch (err) {
      res.status(400).json({ message: err.message })
    }
  }

  async getAll (req, res) {
    try {
      const users = await this.authService.getAllUsers()
      res.json(users)
    } catch (err) {
      res.status(400).json({ message: err.message })
    }
  }

  async setcookie (req, res) {
    try {
      const userToken = req.headers.authorization
      res.setHeader('Set-Cookie', `token=${userToken}; Path=/; HttpOnly; Max-Age=${tenYearsInSeconds}`)
      res.send('got a cookie')
    } catch (err) {
      res.status(400).json({ message: err.message })
    }
  }
}

module.exports = AuthController
