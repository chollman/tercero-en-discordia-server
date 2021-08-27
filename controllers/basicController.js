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
 * Ideally should use this function in ALL routes that use a single resource from the DB.
 * We set the property "reqDbObject" on the req, so we can access the resource being used with a common name
 * for all functions. So instead of having req.category or req.book, we have req.reqDbObject, and we can
 * use this to easy access on helpers and validations, otherwise we need to pass as parameter the name of the key
 * (category or book, for example)
 * @param objectName The name of the object, for example category or blogCategory
 * @param mongooseModel
 * @param errorMessage
 * @returns {(function(*, *, *, *=): void)|*}
 */
exports.getObjectById = (mongooseModel, errorMessage) => (req, res, next, id) => {
    mongooseModel.findById(id).exec((err, dbObject) => {
        if (err || !dbObject) {
            return res.status(400).json({
                error: errorMessage,
            });
        }
        req.reqDbObject = dbObject;
        next();
    });
};

exports.getObject = (req, res) => res.json(req.reqDbObject);

exports.createObject = (mongooseModel) => (req, res) => {
    const dbObject = new mongooseModel(req.fields);
    saveInDB(dbObject, res, 201);
};

exports.updateObject = (req, res) => {
    let dbObject = _.extend(req.reqDbObject, req.fields);
    saveInDB(dbObject, res, 200);
};

exports.deleteObject = (successMessage) => async (req, res) => {
    const dbObject = req.reqDbObject;
    deleteFromDB(dbObject, res, successMessage);
};
