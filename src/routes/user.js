const express = require("express");
const router = express.Router();

require("../services/passport");
const passport = require("passport");

const { isAuth, isAdmin } = require("../controllers/authentication");
const { userById, readUser, updateUser } = require("../controllers/user");

const requireAuth = passport.authenticate("jwt", { session: false });

router.param("userId", userById);
// Example route with isAuth middleware: con este middleware el usuario tiene que matchear su token con su id en base de datos para poder acceder
// Example route with isAdmin middleware: con este middleware el usuario tiene que tener role > 0 para poder acceder
router.get("/secret/:userId", requireAuth, isAuth, isAdmin, (req, res) => {
    res.json({ user: req.profile });
});

router.get("/users/:userId", requireAuth, isAuth, readUser);
router.put("/users/:userId", requireAuth, isAuth, updateUser);

module.exports = router;
