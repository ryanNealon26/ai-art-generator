const mongoose = require("mongoose");
const imageSchema = new mongoose.Schema({
    imageUrl: String, 
    prompt: String
})

module.exports = mongoose.model('image', imageSchema)