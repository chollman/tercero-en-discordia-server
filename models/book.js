const mongoose = require("mongoose");
const { Schema } = mongoose;

const bookSchema = new Schema({
    title: {
        type: String,
        required: true,
        maxlength: 100,
    },
    author: {
        type: String,
        required: true,
        maxlength: 100,
    },
    description: {
        type: String,
        required: true,
        maxlength: 2000,
    },
    coverImage: {
        data: Buffer,
        contentType: String,
    },
    backCoverImage: {
        data: Buffer,
        contentType: String,
    },
});

module.exports = mongoose.model("books", bookSchema);