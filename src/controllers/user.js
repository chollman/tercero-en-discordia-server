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

exports.readUser = (req, res, next) => {
    req.profile.password = undefined;
    return res.json(req.profile);
};

exports.updateUser = (req, res, next) => {
    User.findOneAndUpdate({ _id: req.profile._id }, { $set: req.body }, { new: true }, (err, user) => {
        if (err) {
            return res.status(400).json({
                error: "No estás autorizado a realizar ésta acción",
            });
        }
        user.password = undefined;
        res.json(user);
    });
};
