const mongoose = require("mongoose");
const { Schema } = mongoose;

const blogTagSchema = new Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
            unique: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("blog-tags", blogTagSchema);
