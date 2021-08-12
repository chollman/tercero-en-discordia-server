const formidable = require('formidable');
const Book = require("../models/book");

exports.getAllBooks = (req, res, next, id) => {
        res.send({
            books: [{ name: "Test" }, { name: "Test2" }],
            numberOfBooks: 2,
        });
};

exports.read = (req, res, next) => {
    res.send("WIP");
};

// Middleware to instantiate the book each time it is used
exports.getBookById = (req, res, next, id) => {
    console.log(id);
    next();
};

exports.createBook = (req, res, next) => {
    let form = new formidable.IncomingForm();
};

exports.updateBook = (req, res, next) => {
    res.send("WIP");
};

exports.deleteBook = (req, res, next) => {
    res.send("WIP");
};
