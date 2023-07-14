const express = require('express')
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const authRoute = require("./routes/auth");
const usersRoute = require("./routes/users");
const hotelsRoute = require("./routes/hotels");
const roomsRoute = require("./routes/rooms");

const app = express()
const port = 3000

dotenv.config();
  
// Mongodb connection / messages
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("connected to MongoDB");
  } catch (error) {
    throw error;
  }
}; 

mongoose.connection.on("disconnected", () => {
  console.log("mongooseDB disconnected")
})

// middleware
app.use(cookieParser());
app.use(express.json());
app.use(cors());

//Routes
app.use("/auth", authRoute)
app.use("/users", usersRoute)
app.use("/hotels", hotelsRoute)
app.use("/rooms", roomsRoute)

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong";

  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
    });
  });

app.listen(port, () => {
  connect()
  console.log(`Example app listening on port ${port}`)
})