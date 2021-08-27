const express = require("express");
const router = express.Router();

require("../services/passport");
const passport = require("passport");

const { signup, signin } = require("../controllers/authentication");
const { validateUserSignup } = require("../helpers/validations");

const requireAuth = passport.authenticate("jwt", { session: false });
const requireSignin = passport.authenticate("local", { session: false });

router.get("/", requireAuth, (req, res) => {
    res.send({ hi: "there" });
});
router.post("/signin", requireSignin, signin);
router.post("/signup", validateUserSignup, signup);

module.exports = router;
