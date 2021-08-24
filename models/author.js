const mongoose = require("mongoose");
const { Schema } = mongoose;

const authorSchema = new Schema(
    {
        name: { type: String, trim: true, required: true },
        biography: { type: String, trim: true },
        photo: { data: Buffer, contentType: String },
        twitterLink: { type: String, trim: true },
        instagramLink: { type: String, trim: true },
        facebookLink: { type: String, trim: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("authors", authorSchema);
