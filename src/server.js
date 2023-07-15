const express = require('express');
const apiKey = require("./config.js")
const app = express();
const http = require("http");
const {Server} = require("socket.io");
const server = http.createServer(app);
const cors = require("cors");
const { Configuration, OpenAIApi } = require("openai");
const config = new Configuration({
  apiKey:  apiKey,
});
const openai = new OpenAIApi(config);
app.use(cors());
const io = new Server(server, {
  cors: {
    origin: "https://ai-create-art-2cb1b1626f9c.herokuapp.com/",
    methods: ["GET", "POST"]
  },
});
io.on("connection", (socket) => {
  socket.on("createArt", async (data) => {
    try{
      const response = await openai.createImage({
        prompt: data,
        n: 1,
        size: "1024x1024",
      });
      var image_url = response.data.data[0].url;
      console.log(image_url);
      socket.emit("imageData", image_url)
      imageData.save()
      console.log("Successfully Saved")
    }catch(err){
     image_url = "no url"
     socket.emit("imageData", image_url)
     console.log(image_url);
    }
  })
  socket.on("chatGPT", () => {
    openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{role: 'user', content: "Create me a random description to create art, the description must be less than 240 characters including spacing"}]
    }).then(res =>{
      var gptResponse = res.data.choices[0].message.content;
      socket.emit("gptResponse", gptResponse)
    })
  })
  socket.on("regenerateImage", async (data) => {
    const response = await openai.createImage({
      prompt: data,
      n: 1,
      size: "1024x1024",
    });
    var regenerated_url = response.data.data[0].url;
    socket.emit("sendRegeneratedUrl", regenerated_url)
  })
});
const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  console.log("Server is Running")
})