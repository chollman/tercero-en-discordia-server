const _ = require("lodash");
const { errorHandler } = require("../helpers/dbErrorHandler");
const { setImageInObject } = require("../helpers/utils");
const Book = require("../models/book");
const Category = require("../models/category");

const MAX_NUMBER_OF_FETCHED_BOOKS = 100;
const MAX_NUMBER_OF_FETCHED_RELATED_BOOKS = 5;

//Example call: /api/books?limit=5&sortBy=title&order=asc
exports.getAllBooks = (req, res) => {
    let order = req.query.order ? req.query.order : "asc";
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
    let limit = req.query.limit ? parseInt(req.query.limit) : MAX_NUMBER_OF_FETCHED_BOOKS;

    const query = {};

    addCategoriesToQuery(query, req);

    Book.find(query)
        .populate("categories")
        .populate("authors", "-photo")
        .sort([[sortBy, order]])
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err),
                });
            }
            res.json(data.map(createBookForResponse));
        });
};

exports.getBook = async (req, res) => {
    const book = req.reqDbObject;
    await book.populate("authors", "-photo").populate("categories").execPopulate();
    res.json(createBookForResponse(req.reqDbObject));
};

exports.createBook = async (req, res) => {
    const { fields, files } = req;
    let book = new Book(fields);
    setCoversInBook(book, files);
    try {
        await book.save();
        await book.populate("categories").populate("authors", "-photo").execPopulate();
        res.status(201).json(createBookForResponse(book));
    } catch (err) {
        return res.status(400).json({
            error: errorHandler(err),
        });
    }
};

exports.updateBook = async (req, res) => {
    const { fields, files } = req;
    let book = _.extend(req.reqDbObject, fields);
    setCoversInBook(book, files);
    try {
        await book.save();
        await book.populate("categories").populate("authors", "-photo").execPopulate();
        res.status(200).json(createBookForResponse(book));
    } catch (err) {
        return res.status(400).json({
            error: errorHandler(err),
        });
    }
};

exports.getCover = (coverField) => (req, res, next) => {
    const book = req.reqDbObject;
    if (book[coverField].data) {
        res.set("Content-Type", book[coverField].contentType);
        return res.send(book[coverField].data);
    }
    next();
};

// Example call: /api/books/search?search=test&categories=611b59bb6625d74bc8d7e630
exports.getBooksBySearch = (req, res) => {
    const query = {};

    addCategoriesToQuery(query, req);
    addSearchToQuery(query, req);

    Book.find(query, (err, books) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err),
            });
        }
        res.json(books.map(createBookForResponse));
    })
        .populate("categories")
        .populate("authors", "-photo");
};

exports.getRelatedBooks = (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : MAX_NUMBER_OF_FETCHED_RELATED_BOOKS;
    const book = req.reqDbObject;

    Book.find({ _id: { $ne: book }, category: book.category })
        .limit(limit)
        .populate("categories")
        .populate("authors", "-photo")
        .exec((err, books) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err),
                });
            }
            res.json(books.map(createBookForResponse));
        });
};

exports.getCategoriesInUse = (req, res) => {
    Book.distinct("categories", {}, (err, categoryIds) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err),
            });
        }
        Category.find({ _id: { $in: categoryIds } }).exec((err, categories) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err),
                });
            }
            res.json(categories);
        });
    });
};

const addCategoriesToQuery = (query, req) => {
    if (req.query.categories) {
        query.category = { $in: req.query.categories.split(",") };
    }
};

const addSearchToQuery = (query, req) => {
    if (req.query.search) {
        const regex = { $regex: req.query.search, $options: "i" };
        query.$or = [{ author: regex }, { title: regex }, { description: regex }, { isbn: regex }];
    }
};

// Can't add properties to Mongoose object, so we turn it to JS object to return it.
const createBookForResponse = (book) => {
    let bookForResponse = book.toObject();
    setCoverStatus(bookForResponse);
    removeImages(bookForResponse);
    return bookForResponse;
};

const removeImages = (book) => {
    book.coverImage = undefined;
    book.backCoverImage = undefined;
};

const setCoverStatus = (book) => {
    book.hasCoverImage = !!book.coverImage;
    book.hasBackCoverImage = !!book.backCoverImage;
};

const setCoversInBook = (book, files) => {
    setImageInObject(book.coverImage, files.coverImage);
    setImageInObject(book.backCoverImage, files.backCoverImage);
};
