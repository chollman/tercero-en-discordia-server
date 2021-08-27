const { errorHandler } = require("../helpers/dbErrorHandler");

exports.saveInDB = (dbObject, res, successStatusCode) => {
    dbObject.save((err, result) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err),
            });
        }
        return res.status(successStatusCode).json(result);
    });
};

exports.deleteFromDB = (dbObject, res, successMessage) => {
    dbObject.remove((err) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err),
            });
        }
        res.json({ message: successMessage });
    });
};
