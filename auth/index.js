const express = require("express");
const connectToDB = require("./connectToDB");
const authRoutes = require("./src/Routes/authRoutes");
const authMiddlewares = require('./src/middlewares/authMiddlewares');
const app = express();
const port = process.env.PORT || 8002;




connectToDB();
app.use(express.json());
app.use(authMiddlewares.cookieParser());
app.use("/auth", authRoutes);

app.listen(port, '0.0.0.0', () => {
    console.log(`Authentication service is running on port ${port}!`);
});




