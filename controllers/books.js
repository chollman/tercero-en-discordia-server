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

exports.getById = (req, res, next) => {
    console.log(req.params.id);
    res.send("WIP");
};

exports.create = (req, res, next) => {
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
            book.coverImage.data = fs.readFileSync(files.coverImage.path);
            book.coverImage.contentType = files.coverImage.type;
        }
        if (files.backCoverImage) {
            book.backCoverImage.data = fs.readFileSync(files.backCoverImage.path);
            book.backCoverImage.contentType = files.backCoverImage.type;
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

exports.delete = (req, res, next) => {
    res.send("WIP");
};
