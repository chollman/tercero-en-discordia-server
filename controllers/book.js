const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const { errorHandler } = require("../helpers/dbErrorHandler");
const Book = require("../models/book");

const MAX_NUMBER_OF_FETCHED_BOOKS = 100;

//Example call with params: api/books?limit=5&sortBy=title&order=asc

exports.getAllBooks = (req, res) => {
    let order = req.query.order ? req.query.order : "asc";
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
    let limit = req.query.limit ? parseInt(req.query.limit) : MAX_NUMBER_OF_FETCHED_BOOKS;

    const query = {};

    addCategoriesToQuery(query, req);

    Book.find(query)
        .select("-coverImage -backCoverImage")
        .populate("category")
        .sort([[sortBy, order]])
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err),
                });
            }
            res.json(data);
        });
};

exports.getById = (req, res, next, id) => {
    Book.findById(id)
        .populate("category")
        .exec((err, book) => {
            if (err || !book) {
                return res.status(400).json({
                    error: "El libro no existe",
                });
            }
            req.book = book;
            next();
        });
};

exports.getBook = (req, res) => {
    req.book.coverImage = undefined;
    req.book.backCoverImage = undefined;
    return res.json(req.book);
};

exports.createBook = (req, res, next) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "La imagen no se pudo cargar",
            });
        }

        const { title, author, category } = fields;

        if (!title || !author || !category) {
            return res.status(400).json({
                error: "Debe especificar al menos un título, autor y categoría",
            });
        }

        let book = new Book(fields);

        if (files.coverImage) {
            if (files.coverImage.size > 1000000) {
                return res.status(400).json({
                    error: "La imágen es demasiado pesada",
                });
            }
            book.coverImage.data = fs.readFileSync(files.coverImage.path);
            book.coverImage.contentType = files.coverImage.type;
        }
        if (files.backCoverImage) {
            if (files.backCoverImage.size > 1000000) {
                return res.status(400).json({
                    error: "La imágen es demasiado pesada",
                });
            }
            book.backCoverImage.data = fs.readFileSync(files.backCoverImage.path);
            book.backCoverImage.contentType = files.backCoverImage.type;
        }

        book.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err),
                });
            }
            result.coverImage = undefined;
            result.backCoverImage = undefined;
            res.json(result);
        });
    });
};

exports.updateBook = (req, res, next) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "La imagen no se pudo cargar",
            });
        }

        const { title, author, category } = fields;

        if (!title || !author || !category) {
            return res.status(400).json({
                error: "Debe especificar al menos un título, autor y categoría",
            });
        }

        let book = req.book;
        book = _.extend(book, fields);

        if (files.coverImage) {
            if (files.coverImage.size > 1000000) {
                return res.status(400).json({
                    error: "La imágen es demasiado pesada",
                });
            }
            book.coverImage.data = fs.readFileSync(files.coverImage.path);
            book.coverImage.contentType = files.coverImage.type;
        }
        if (files.backCoverImage) {
            if (files.backCoverImage.size > 1000000) {
                return res.status(400).json({
                    error: "La imágen es demasiado pesada",
                });
            }
            book.backCoverImage.data = fs.readFileSync(files.backCoverImage.path);
            book.backCoverImage.contentType = files.backCoverImage.type;
        }

        book.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err),
                });
            }
            result.coverImage = undefined;
            result.backCoverImage = undefined;
            res.json(result);
        });
    });
};

exports.deleteBook = (req, res, next) => {
    let book = req.book;
    book.remove((err, deletedBook) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err),
            });
        }
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
        res.json(books);
    })
        .select("-coverImage -backCoverImage")
        .populate("category");
};

addCategoriesToQuery = (query, req) => {
    if (req.query.categories) {
        query.category = { $in: req.query.categories.split(",") };
    }
};

addSearchToQuery = (query, req) => {
    if (req.query.search) {
        const regex = { $regex: req.query.search, $options: "i" };
        query.$or = [{ author: regex }, { title: regex }, { description: regex }, { isbn: regex }];
    }
};
