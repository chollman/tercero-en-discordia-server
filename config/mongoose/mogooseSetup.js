const keys = require("../keys");
const mongoose = require("mongoose");

exports.mongooseConnect = async () => {
    await mongoose.connect(keys.mongoURI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
    });
    console.log("DB Connected");
};
