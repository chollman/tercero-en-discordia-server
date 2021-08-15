const mongoose = require("mongoose");
const { Schema } = mongoose;

const bookSchema = new Schema(
    {
        id: Number,
        title: String,
        description: String,
        author: String,
        coverImage: String,
        backCoverImage: String,
    },
    { timestamps: true }
);

module.exports = mongoose.model("books", bookSchema);
