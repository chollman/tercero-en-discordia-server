const formidable = require("formidable");
const mongoose = require("mongoose");
const _ = require("lodash");

exports.validateFormStatus = async (req, res, next) => {
    let form = formidable({ multiples: true, keepExtensions: true });

    await new Promise((resolve) => {
        form.parse(req, (err, fields, files) => {
            if (err) {
                return res.status(400).json({
                    error: "La imagen no se pudo cargar",
                });
            }
            req.fields = fields;
            req.files = files;
            console.log("Form received ok");
            resolve();
        });
    });
    next();
};

exports.validateSimpleRequest = (req, res, next) => {
    if (!req.body || _.isEmpty(req.body)) {
        return res.status(400).json({
            error: "No se recibió un body en la request",
        });
    }
    req.fields = req.body;
    next();
};

exports.validateUserSignup = (req, res, next) => {
    req.check("email")
        .matches(/.+\@.+\..+/)
        .withMessage("El mail debe estar bien formado");
    req.check("password", "Debe escribir una contraseña").notEmpty();
    req.check("password").isLength({ min: 6 }).withMessage("La contraseña tiene que tener al menos 6 caracteres");
    const errors = req.validationErrors();
    if (errors) {
        const firstError = errors.map((error) => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }
    next();
};

exports.validateFieldsNotNull = (arrayOfFields, errorMsg) => (req, res, next) => {
    if (!arrayOfFields.every((elem) => !!req.fields[elem])) {
        return res.status(400).json({
            error: errorMsg,
        });
    }
    next();
};

exports.validateObjectId = (objectIdField, mongooseModel) => async (req, res, next) => {
    if (req.fields[objectIdField]) {
        const objectId = req.fields[objectIdField];
        const validationError = await isValidObjectId(objectId, mongooseModel, objectIdField);
        if (validationError) {
            return res.status(400).json(validationError);
        }
    }
    next();
};

exports.validateObjectIdArray = (objectIdArrayField, mongooseModel) => async (req, res, next) => {
    if (req.fields[objectIdArrayField]) {
        const objectIdArray = req.fields[objectIdArrayField];
        if (!objectIdArray.length) {
            return res.status(400).json({
                error: `El array de ids no puede ser vacío: ${objectIdArrayField}`,
            });
        }
        if (objectIdArray.length !== new Set(objectIdArray).size) {
            return res.status(400).json({
                error: `El array de ids no puede tener duplicados: ${objectIdArrayField}`,
            });
        }
        for (let objectId of objectIdArray) {
            const validationError = await isValidObjectId(objectId, mongooseModel, objectIdArrayField);
            if (validationError) {
                return res.status(400).json(validationError);
            }
        }
    }
    next();
};

exports.validateImage = (imageField) => (req, res, next) => {
    const image = req.files[imageField];
    if (image) {
        if (!image.size > 0) {
            return res.status(400).json({
                error: `Se recibió una imagen nula: ${imageField}`,
            });
        }
        if (image.size > 1000000) {
            return res.status(400).json({
                error: `La imagen es demasiado pesada: ${imageField}`,
            });
        }
    }
    next();
};

exports.validateNoReferences = (mongooseModel, foreignKey, foreignKeyMongooseModel, errorMessage) => async (
    req,
    res,
    next
) => {
    const object = req.reqDbObject;
    const idsInUse = await foreignKeyMongooseModel.distinct(foreignKey);
    const objectsInUse = await mongooseModel.find({ _id: { $in: idsInUse } });
    for (let objectInUse of objectsInUse) {
        if (objectInUse.id === object.id) {
            return res.status(400).json({
                error: errorMessage,
            });
        }
    }
    next();
};

const existsInDatabase = async (id, mongooseModel) => {
    return !!(await mongooseModel.findById(id));
};

const isValidObjectId = async (objectId, mongooseModel, errorField) => {
    if (!mongoose.Types.ObjectId.isValid(objectId)) {
        return {
            error: `Se envío un formato de id incorrecto: ${errorField}`,
        };
    }
    if (!(await existsInDatabase(objectId, mongooseModel))) {
        return {
            error: `El id no existe en la base de datos: ${errorField}`,
        };
    }
    return null;
};
