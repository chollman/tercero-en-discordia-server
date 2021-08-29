const Author = require("../models/author");
const { errorHandler } = require("../helpers/dbErrorHandler");
const { saveInDB } = require("../helpers/dbHelper");
const { setImageInObject } = require("../helpers/utils");
const _ = require("lodash");
const Book = require("../models/book");

const MAX_NUMBER_OF_FETCHED_AUTHORS = 20;

exports.getAllAuthors = (req, res) => {
    let order = req.query.order ? req.query.order : "asc";
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
    let limit = req.query.limit ? parseInt(req.query.limit) : MAX_NUMBER_OF_FETCHED_AUTHORS;

    Author.find()
        .sort([[sortBy, order]])
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err),
                });
            }
            res.json(data.map(createAuthorForResponse));
        });
};

exports.getAuthor = (req, res) => res.json(createAuthorForResponse(req.reqDbObject));

exports.createAuthor = async (req, res) => {
    const { fields, files } = req;
    let author = new Author(fields);
    setPhotoOfAuthor(author, files);
    const error = await saveInDB(author);
    if (error) {
        res.status(400).json(error);
    }
    res.status(201).json(createAuthorForResponse(author));
};

exports.updateAuthor = async (req, res) => {
    const { fields, files } = req;
    let author = _.extend(req.reqDbObject, fields);
    setPhotoOfAuthor(author, files);
    const error = await saveInDB(author);
    if (error) {
        res.status(400).json(error);
    }
    res.status(200).json(createAuthorForResponse(author));
};

exports.getAuthorPhoto = (req, res, next) => {
    const author = req.reqDbObject;
    if (author.photo.data) {
        res.set("Content-Type", author.photo.contentType);
        return res.send(author.photo.data);
    }
    next();
};

exports.getAuthorsBySearch = (req, res) => {
    const query = {};

    addSearchToQuery(query, req);

    Author.find(query, (err, authors) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err),
            });
        }
        res.json(authors.map(createAuthorForResponse));
    });
};

const createAuthorForResponse = (author) => {
    let authorForResponse = author.toObject();
    setPhotoStatus(authorForResponse);
    removePhoto(authorForResponse);
    return authorForResponse;
};

const removePhoto = (author) => (author.photo = undefined);

const setPhotoStatus = (author) => (author.hasPhoto = !!author.photo);

const setPhotoOfAuthor = (author, files) => setImageInObject(author.photo, files.photo);

const addSearchToQuery = (query, req) => {
    if (req.query.search) {
        const regex = { $regex: req.query.search, $options: "i" };
        query.$or = [{ name: regex }, { biography: regex }];
    }
};
