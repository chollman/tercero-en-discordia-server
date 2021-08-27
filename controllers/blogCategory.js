const BlogCategory = require("../models/blogCategory");
const { errorHandler } = require("../helpers/dbErrorHandler");
// TODO DELETE FILE, NO LONGER NEEDED
exports.getAllBlogCategories = (req, res) => {
    BlogCategory.find().exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err),
            });
        }
        res.json(data);
    });
};

exports.blogCatById = (req, res, next, id) => {
    BlogCategory.findById(id).exec((err, blogCategory) => {
        if (err || !blogCategory) {
            return res.status(400).json({
                error: "La categoría de Blog no existe",
            });
        }
        req.blogCategory = blogCategory;
        next();
    });
};

exports.getBlogCategory = (req, res) => res.json(req.blogCategory);

exports.createBlogCategory = async (req, res) => {
    const blogCategory = new BlogCategory(req.fields);
    await blogCategory.save((err, result) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err),
            });
        }
        return res.status(201).json(result);
    });
};

exports.updateBlogCategory = async (req, res) => {
    const blogCategory = req.blogCategory;
    blogCategory.name = req.body.name;
    await blogCategory.save((err, result) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err),
            });
        }
        return res.json(result);
    });
};

exports.deleteBlogCategory = (req, res) => {
    const blogCategory = req.blogCategory;
    // TODO: implement when Blog is developed
    // const blogCategoryIdsInUse = await Book.distinct("categories", {});
    // const categoriesInUse = await blogCategory.find({ _id: { $in: blogCategoryIdsInUse } });
    // for (let blogCategoryInUse of categoriesInUse) {
    //     if (blogCategoryInUse.id === blogCategory.id) {
    //         return res.status(400).json({
    //             error: "No se puede borrar la categoría ya que está referenciando al menos un post de Blog",
    //         });
    //     }
    // }
    blogCategory.remove((err) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err),
            });
        }
        res.json({ message: "La categoría de Blog se eliminó correctamente" });
    });
};
