const User = require("../models/user");

exports.userById = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "El usuario no fue encontrado",
            });
        }
        req.profile = user;
        next();
    });
};
