const mongoose = require("mongoose");
const { Schema, ObjectId } = mongoose;

const blogPostSchema = new Schema(
    {
        content: { type: String, trim: true, required: true },
        categories: [{ type: ObjectId, ref: "blog-categories" }],
        tags: [{ type: ObjectId, ref: "blog-tags" }],
        author: { type: String, trim: true },
        commentaries: [{ type: String, trim: true }],
    },
    { timestamps: true }
);

module.exports = mongoose.model("blog-posts", blogPostSchema);
