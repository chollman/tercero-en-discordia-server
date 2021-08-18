const Category = require("../models/category");
const { errorHandler } = require("../helpers/dbErrorHandler");

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
    const category = new Category(req.body);
    category.save((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err),
            });
        }
        res.json({ data });
    });
};

exports.update = (req, res, next) => {
    res.send("WIP");
};

exports.delete = (req, res, next) => {
    res.send("WIP");
};
