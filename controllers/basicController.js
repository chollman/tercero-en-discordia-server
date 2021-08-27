const { errorHandler } = require("../helpers/dbErrorHandler");
const { saveInDB, deleteFromDB } = require("../helpers/dbHelper");
const _ = require("lodash");

exports.getAllObjects = (mongooseModel) => (req, res) => {
    mongooseModel.find().exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err),
            });
        }
        res.json(data);
    });
};

/**
 *
 * @param objectName The name of the object, for example category or blogCategory
 * @param mongooseModel
 * @param errorMessage
 * @returns {(function(*, *, *, *=): void)|*}
 */
exports.getObjectById = (objectName, mongooseModel, errorMessage) => (req, res, next, id) => {
    mongooseModel.findById(id).exec((err, dbObject) => {
        if (err || !dbObject) {
            return res.status(400).json({
                error: errorMessage,
            });
        }
        req[objectName] = dbObject;
        next();
    });
};

exports.getObject = (objectName) => (req, res) => res.json(req[objectName]);

exports.createObject = (mongooseModel) => (req, res) => {
    const dbObject = new mongooseModel(req.fields);
    saveInDB(dbObject, res, 201);
};

exports.updateObject = (objectName) => (req, res) => {
    let dbObject = _.extend(req[objectName], req.fields);
    saveInDB(dbObject, res, 200);
};

exports.deleteObject = (objectName, successMessage) => async (req, res) => {
    const dbObject = req[objectName];
    // Abstraer esta logica en una validation
    // const categoryIdsInUse = await Book.distinct("categories", {});
    // const categoriesInUse = await Category.find({ _id: { $in: categoryIdsInUse } });
    // for (let categoryInUse of categoriesInUse) {
    //     if (categoryInUse.id === category.id) {
    //         return res.status(400).json({
    //             error: "No se puede borrar la categoría ya que está referenciando al menos un libro",
    //         });
    //     }
    // }
    deleteFromDB(dbObject, res, successMessage);
};
