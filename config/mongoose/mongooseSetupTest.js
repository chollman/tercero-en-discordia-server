const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Category = require("../../src/models/category");
const BlogCategory = require("../../src/models/blogCategory");
const Author = require("../../src/models/author");

let mongoServer;

exports.mongooseConnect = async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
    });
    console.log("Test DB Connected");
};

exports.mongooseDisconnect = async () => {
    await mongoose.connection.close();
    await mongoServer.stop();
};

exports.populateDB = async () => {
    const categories = [{ name: "Action" }, { name: "War" }, { name: "Drama" }, { name: "Terror" }];
    const blogCategories = [{ name: "Personal" }, { name: "Finance" }, { name: "Editing" }, { name: "Bestsellers" }];
    const authors = [
        {
            name: "Willy",
            biography: "Some bio",
            photo: null,
            twitterLink: "www.twitter.com",
            instagramLink: "www.ig.com",
            facebookLink: "www.fb.com",
        },
        {
            name: "John Wayne",
            biography: "Some bio",
            photo: null,
            twitterLink: "www.twitter.com",
            instagramLink: "www.ig.com",
            facebookLink: "www.fb.com",
        },
    ];
    for (let category of categories) {
        let dbCategory = new Category(category);
        await dbCategory.save();
    }
    for (let category of blogCategories) {
        let dbCategory = new BlogCategory(category);
        await dbCategory.save();
    }
    for (let author of authors) {
        let dbAuthor = new Author(author);
        await dbAuthor.save();
    }
};
