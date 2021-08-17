const formidable = require("formidable");
//const _ = require("lodash");
const fs = require("fs");
const { errorHandler } = require("../helpers/dbErrorHandler");
const Book = require("../models/book");

exports.getAll = (req, res, next) => {
    res.send({
        books: [{ name: "Test" }, { name: "Test2" }],
        numberOfBooks: 2,
    });
};

exports.getById = (req, res, next, id) => {
    Book.findById(id).exec((err, book) => {
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

        const { title, author, category } = fields;

        if (!title || !author || !category) {
            return res.status(400).json({
                error: "Debe especificar al menos un título, autor y categoría",
            });
        }

        book.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err),
                });
            }
            res.json(result);
        });
    });
};

exports.update = (req, res, next) => {
    res.send("WIP");
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
