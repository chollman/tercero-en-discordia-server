const { errorHandler } = require("../helpers/dbErrorHandler");

exports.saveInDB = async (dbObject) => {
    try {
        await dbObject.save();
    } catch (err) {
        return {
            error: errorHandler(err),
        };
    }
    return null;
};

exports.deleteFromDBWithResponse = (dbObject, res, successMessage) => {
    dbObject.remove((err) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err),
            });
        }
        res.json({ message: successMessage });
    });
};
