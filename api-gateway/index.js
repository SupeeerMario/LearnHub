const express = require("express");
const app = express();
const cors = require("cors");



app.use(express.json());
app.use(cors());


const port = process.env.PORT || 8001;
app.listen(port, '0.0.0.0', () => {
    console.log(`API Gateway is running on port ${port}!`);
});


