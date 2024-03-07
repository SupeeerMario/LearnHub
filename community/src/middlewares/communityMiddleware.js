const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

dotenv.config()

async function readCookie (req, res, next) {
  try {
    const tokenCookie = req.cookies.token
    const token = tokenCookie || null

    // Store the token in the request object
    req.token = token

    // Move next() inside the try block
    next()
  } catch (error) {
    console.error(`Error while processing token: ${error}`)
    res.status(500).json({ message: 'Internal Server Error' })
    next(error) // Pass the error to the next middleware or route handler
  }
}

function userFromToken (req, res, next) {
  const tokenHeader = req.headers.authorization

  if (!tokenHeader) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' })
  }

  const token = tokenHeader.split(' ')[1] // Remove 'Bearer ' prefix

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' })
    }

    if (!decoded || !decoded.userId) {
      return res.status(401).json({ error: 'Unauthorized: Invalid decoded user object' })
    }

    // Attach decoded information to the request object
    req.decodedUserId = decoded.userId
    req.username = decoded.username
    console.log(`id is ${req.decodedUserId}`)
    console.log(`username is ${req.username}`)

    next()
  })
}

module.exports = { readCookie, userFromToken }
