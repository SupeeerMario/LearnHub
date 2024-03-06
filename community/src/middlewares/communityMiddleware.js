require('dotenv').config()

async function readCookie (req, res, next) {
  try {
    const tokenCookie = req.cookies.token
    this.token = tokenCookie ? tokenCookie.replace(/^Bearer\s/, '') : null

    // Instead of sending the response, store the token in the request object
    req.token = this.token

    // Move next() inside the try block
    next()
  } catch (error) {
    console.error(`Error while processing token: ${error}`)
    res.status(500).json({ message: 'Internal Server Error' })
    next(error) // Pass the error to the next middleware or route handler
  }
}

module.exports = { readCookie }
