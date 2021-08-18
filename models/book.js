const mongoose = require("mongoose");
const { Schema, ObjectId } = mongoose;

const bookSchema = new Schema(
    {
        title: { type: String, trim: true, required: true },
        description: { type: String, trim: true },
        author: { type: String, trim: true },
        category: { type: ObjectId, ref: "Category", required: true },
        coverImage: { data: Buffer, contentType: String },
        backCoverImage: { data: Buffer, contentType: String },
    },
    { timestamps: true }
);

module.exports = mongoose.model("books", bookSchema);
