const Category = require("../models/category");
const { errorHandler } = require("../helpers/dbErrorHandler");
const Book = require("../models/book");

exports.getAllCategories = (req, res) => {
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

exports.getCategory = (req, res) => res.json(req.category);

exports.createCategory = async (req, res) => {
    const category = new Category(req.fields);
    await category.save((err, result) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err),
            });
        }
        return res.status(401).json(result);
    });
};

exports.updateCategory = async (req, res) => {
    const category = req.category;
    category.name = req.body.name;
    await category.save((err, result) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err),
            });
        }
        return res.json(result);
    });
};

exports.deleteCategory = async (req, res) => {
    const category = req.category;
    const categoryIdsInUse = await Book.distinct("categories", {});
    const categoriesInUse = await Category.find({ _id: { $in: categoryIdsInUse } });
    for (let categoryInUse of categoriesInUse) {
        if (categoryInUse.id === category.id) {
            return res.status(400).json({
                error: "No se puede borrar la categoría ya que está referenciando al menos un libro",
            });
        }
    }
    category.remove((err) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err),
            });
        }
        res.json({ message: "La categoría se eliminó correctamente" });
    });
};
