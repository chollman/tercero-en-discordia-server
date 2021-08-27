const mongoose = require("mongoose");
const { Schema } = mongoose;

const blogCategorySchema = new Schema(
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

module.exports = mongoose.model("blog-categories", blogCategorySchema);
