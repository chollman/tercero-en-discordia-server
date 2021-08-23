const jwt = require("jwt-simple");
const User = require("../models/user");
const config = require("../config/keys");

function tokenForUser(user) {
    const timestamp = new Date().getTime();
    return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

exports.signin = (req, res, next) => {
    req.user.password = undefined;
    res.send({ token: tokenForUser(req.user), user: req.user });
};

exports.signup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
        return res.status(422).send({ error: "Debes ingresar un mail y contraseña" });
    }

    User.findOne({ email: email }, (err, existingUser) => {
        if (err) {
            return next(err);
        }
        if (existingUser) {
            return res.status(422).send({ error: "El mail ya está en uso" });
        }
        const user = new User({
            email: email,
            password: password,
        });

        user.save(function (err) {
            if (err) {
                return next(err);
            }
            res.json({ token: tokenForUser(user) });
        });
    });
};

exports.isAuth = (req, res, next) => {
    let user = req.profile && req.user && req.profile.id === req.user.id;
    if (!user) {
        return res.status(403).json({
            error: "Acceso denegado",
        });
    }
    next();
};

exports.isAdmin = (req, res, next) => {
    if (req.profile.role === 0) {
        return res.status(403).json({
            error: "El usuario no tiene privilegios de administrador",
        });
    }
    next();
};

exports.userSignupValidator = (req, res, next) => {
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
