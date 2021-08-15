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
