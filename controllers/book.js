const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const { errorHandler } = require("../helpers/dbErrorHandler");
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
        .populate("category")
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

exports.getById = (req, res, next, id) => {
    Book.findById(id)
        .populate("category")
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

exports.createBook = (req, res) => {
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

        setImageAsCover(book.coverImage, files.coverImage, res);
        setImageAsCover(book.backCoverImage, files.backCoverImage, res);

        book.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err),
                });
            }
            res.status(201).json(createBookForResponse(result));
        });
    });
};

exports.updateBook = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "La imagen no se pudo cargar",
            });
        }

        // TODO: Check if the category received is valid

        let book = req.book;
        book = _.extend(book, fields);

        setImageAsCover(book.coverImage, files.coverImage, res);
        setImageAsCover(book.backCoverImage, files.backCoverImage, res);

        book.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err),
                });
            }
            res.json(createBookForResponse(result));
        });
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
    }).populate("category");
};

exports.getRelatedBooks = (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : MAX_NUMBER_OF_FETCHED_RELATED_BOOKS;

    Book.find({ _id: { $ne: req.book }, category: req.book.category })
        .limit(limit)
        .populate("category")
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
    Book.distinct("category", {}, (err, categoryIds) => {
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

// Can't add properties to Mongoose object, so we turn it to JS object to return it.
createBookForResponse = (book) => {
    let bookForResponse = book.toObject();
    setCoverStatus(bookForResponse);
    removeImages(bookForResponse);
    return bookForResponse;
};

removeImages = (book) => {
    book.coverImage = undefined;
    book.backCoverImage = undefined;
};

setCoverStatus = (book) => {
    book.hasCoverImage = !!book.coverImage;
    book.hasBackCoverImage = !!book.backCoverImage;
};

setImageAsCover = (bookCover, image, res) => {
    if (image) {
        if (!image.size > 0) {
            return res.status(400).json({
                error: "Se recibió una imagen nula",
            });
        }
        if (image.size > 1000000) {
            return res.status(400).json({
                error: "La imagen es demasiado pesada",
            });
        }
        bookCover.data = fs.readFileSync(image.path);
        bookCover.contentType = image.type;
    }
};
