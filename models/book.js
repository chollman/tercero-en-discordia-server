const mongoose = require("mongoose");
const { Schema, ObjectId } = mongoose;

const bookSchema = new Schema(
    {
        title: { type: String, trim: true, required: true },
        description: { type: String, trim: true },
        author: { type: String, trim: true, required: true },
        isbn: { type: String, trim: true },
        numberOfPages: { type: Number },
        publicationDate: { type: Date },
        category: { type: ObjectId, ref: "categories", required: true },
        coverImage: { data: Buffer, contentType: String },
        backCoverImage: { data: Buffer, contentType: String },
        linkToEbook: { type: String, trim: true },
        linkToPaperBook: { type: String, trim: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("books", bookSchema);
