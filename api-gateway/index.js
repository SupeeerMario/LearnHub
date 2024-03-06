const express = require('express')
const app = express()
const cors = require('cors')
const cookieParser = require('cookie-parser')
const port = process.env.PORT || 8001

app.use(express.json())
app.use(cookieParser())
app.use(cors())

app.listen(port, '0.0.0.0', () => {
  console.log(`API Gateway is running on port ${port}!`)
})
