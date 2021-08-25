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

exports.bookById = (req, res, next, id) => {
    Book.findById(id)
        .populate("categories")
        .populate("authors", "-photo")
        .exec((err, book) => {
            if (err || !book) {
                return res.status(404).json({
                    error: "El libro no existe",
                });
            }
            req.book = book;
            next();
        });
};

exports.getBook = (req, res) => res.json(createBookForResponse(req.book));

exports.createBook = async (req, res) => {
    const { fields, files } = req;
    let book = new Book(fields);
    setCoversInBook(book, files);
    await book.save(async (err) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err),
            });
        }
        await book.populate("categories").populate("authors", "-photo").execPopulate();
        res.status(201).json(createBookForResponse(book));
    });
};

exports.updateBook = async (req, res) => {
    const { fields, files } = req;
    let book = _.extend(req.book, fields);
    setCoversInBook(book, files);
    await book.save(async (err) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err),
            });
        }
        await book.populate("categories").populate("authors", "-photo").execPopulate();
        res.status(201).json(createBookForResponse(book));
    });
};

exports.deleteBook = (req, res) => {
    let book = req.book;
    book.remove((err, deletedBook) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err),
            });
        }
        console.log(`book: ${deletedBook.id} was deleted by user: ${req.profile.email} `);
        res.json({
            message: "El libro fue borrado correctamente",
        });
    });
};

exports.getCover = (req, res, next) => {
    if (req.book.coverImage.data) {
        res.set("Content-Type", req.book.coverImage.contentType);
        return res.send(req.book.coverImage.data);
    }
    next();
};

exports.getBackCover = (req, res, next) => {
    if (req.book.backCoverImage.data) {
        res.set("Content-Type", req.book.backCoverImage.contentType);
        return res.send(req.book.backCoverImage.data);
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

    Book.find({ _id: { $ne: req.book }, category: req.book.category })
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
