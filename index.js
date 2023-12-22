const express = require("express");
const userRouter = require("./routes/user");
const { connectMongoDB } = require("./connection");
const app = express();
const PORT = 8000;

//Schema

connectMongoDB("YOUR_DB_URL");

app.use(express.urlencoded({ extended: false }));

app.use("/user", userRouter);

app.listen(PORT, () => console.log(`Server is started at PORT: ${PORT}...`));
