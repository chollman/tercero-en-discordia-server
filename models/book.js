const mongoose = require("mongoose");
const { Schema } = mongoose;

const bookSchema = new Schema({
    id: Number,
    title: String,
    description: String,
    coverImage: String,
    backCoverImage: String
});

module.exports = mongoose.model("books", bookSchema);