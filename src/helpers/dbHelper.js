const { errorHandler } = require("../helpers/dbErrorHandler");

exports.saveInDB = async (dbObject) => {
    let error = null;
    try {
        await dbObject.save();
    } catch (err) {
        error = {
            error: errorHandler(err),
        };
    }
    return error;
};

exports.deleteFromDBWithResponse = (dbObject, res, successMessage) => {
    dbObject.remove((err) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err),
            });
        }
        return res.json({ message: successMessage });
    });
};
