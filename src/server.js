const express = require('express');
const mongoose = require('mongoose');
const ImageData = require("./imageSchema")
const app = express();
const http = require("http");
const {Server} = require("socket.io");
const server = http.createServer(app);
const cors = require("cors");
app.use(cors());
const imageSchema = require('./imageSchema');
try{
  mongoose.connect(
    "mongodb://127.0.0.1:27017/ai-art-generator", 
    {
      useNewUrlParser: true,
      keepAlive: true,
      useUnifiedTopology: true
    }
  )
  console.log("connection succussful")
}catch{
  console.log("failed to connect")
}
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  },
});
io.on("connection", (socket) => {
  socket.on("imageData", (data) => {
    const imageData = new ImageData({imageUrl: data[0], prompt: data[1]})
    imageData.save()
    console.log("Successfully Saved")
  });
});
server.listen(5000, () => {
  console.log("Server is Running")
})