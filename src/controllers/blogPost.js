const BlogPost = require("../models/blogPost");
const { errorHandler } = require("../helpers/dbErrorHandler");
const { saveInDB } = require("../helpers/dbHelper");
const _ = require("lodash");

const MAX_NUMBER_OF_FETCHED_BLOGPOSTS = 15;

exports.getAllBlogPosts = (req, res) => {
    let order = req.query.order ? req.query.order : "asc";
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
    let limit = req.query.limit ? parseInt(req.query.limit) : MAX_NUMBER_OF_FETCHED_BLOGPOSTS;

    BlogPost.find()
        .sort([[sortBy, order]])
        .limit(limit)
        .populate("categories")
        .populate("tags")
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err),
                });
            }
            return res.json(data);
        });
};

exports.getBlogPost = async (req, res) => {
    const blogPost = req.reqDbObject;
    await blogPost.populate("categories").populate("tags").execPopulate();
    return res.json(blogPost);
};

exports.createBlogPost = async (req, res) => {
    const { fields } = req;
    let blogPost = new BlogPost(fields);
    const error = await saveInDB(blogPost);
    if (error) {
        return res.status(400).json(error);
    }
    await blogPost.populate("categories").populate("tags").execPopulate();
    return res.status(201).json(blogPost);
};

exports.updateBlogPost = async (req, res) => {
    const { fields } = req;
    let blogPost = _.extend(req.reqDbObject, fields);
    const error = await saveInDB(blogPost);
    if (error) {
        return res.status(400).json(error);
    }
    await blogPost.populate("categories").populate("tags").execPopulate();
    return res.status(200).json(blogPost);
};
