const formidable = require("formidable");
const mongoose = require("mongoose");

exports.validateFormStatus = async (req, res, next) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
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

exports.validateFieldsNotNull = (arrayOfFields) => (req, res, next) => {
    if (!arrayOfFields.every((elem) => !!req.fields[elem])) {
        return res.status(400).json({
            error: "Debe especificar al menos un título, autor y categoría",
        });
    }
    next();
};

exports.validateObjectId = (objectIdField, mongooseModel) => async (req, res, next) => {
    if (req.fields[objectIdField]) {
        const objectId = req.fields[objectIdField];
        if (!mongoose.Types.ObjectId.isValid(objectId)) {
            return res.status(400).json({
                error: `Se envío un formato de id incorrecto: ${objectIdField}`,
            });
        }
        if (!(await existsInDatabase(objectId, mongooseModel))) {
            return res.status(400).json({
                error: `El id no existe en la base de datos: ${objectIdField}`,
            });
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

const existsInDatabase = async (id, mongooseModel) => {
    return !!(await mongooseModel.findById(id));
};
