const mongoose = require("mongoose");
const { Schema, ObjectId } = mongoose;

const blogPostSchema = new Schema(
    {
        title: { type: String, trim: true, required: true, unique: true },
        content: { type: String, trim: true },
        categories: [{ type: ObjectId, ref: "blog-categories" }],
        tags: [{ type: ObjectId, ref: "blog-tags" }],
        author: { type: String, trim: true },
        comments: [{ type: String, trim: true }],
    },
    { timestamps: true }
);

module.exports = mongoose.model("blog-posts", blogPostSchema);
