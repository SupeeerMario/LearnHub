require('dotenv').config()

const connectionParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true
}

const config = {
  port: process.env.PORT || 8002,
  mongoURI: process.env.DB,
  connectionParams
}

console.log('DB URL:', config.mongoURI)
console.log('Port:', config.port)

module.exports = config
