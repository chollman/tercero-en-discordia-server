const Category = require("../models/category");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.getAllCategories = (req, res, next) => {
    Category.find().exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err),
            });
        }
        res.json(data);
    });
};

exports.catById = (req, res, next, id) => {
    Category.findById(id).exec((err, category) => {
        if (err || !category) {
            return res.status(400).json({
                error: "La categoría no existe",
            });
        }
        req.category = category;
        next();
    });
};

exports.getCategory = (req, res, next) => {
    return res.json(req.category);
};

exports.createCategory = (req, res, next) => {
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

exports.updateCategory = (req, res, next) => {
    const category = req.category;
    category.name = req.body.name;
    category.save((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err),
            });
        }
        res.json(data);
    });
};

exports.deleteCategory = (req, res, next) => {
    const category = req.category;
    category.remove((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err),
            });
        }
        res.json({ message: "La categoría se eliminó correctamente" });
    });
};
