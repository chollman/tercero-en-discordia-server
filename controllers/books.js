const Book = require("../models/book");

exports.getAllBooks = (req, res, next) => {
    res.send({
        books: [{ name: "Test" }, { name: "Test2" }],
        numberOfBooks: 2
    });
};

exports.getBookById = (req, res, next) => {
    console.log(req.params.id);
    res.send("WIP");
};

exports.createBook = (req, res, next) => {
    res.send("WIP");
};

exports.updateBook = (req, res, next) => {
    res.send("WIP");
};

exports.deleteBook = (req, res, next) => {
    res.send("WIP");
};
