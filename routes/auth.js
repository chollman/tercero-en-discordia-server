const express = require("express");
const router = express.Router();

const { userSignupValidator } = require("../validator");
require("../services/passport");
const passport = require("passport");

const { signup, signin } = require("../controllers/authentication");

const requireAuth = passport.authenticate("jwt", { session: false });
const requireSignin = passport.authenticate("local", { session: false });

router.get("/", requireAuth, (req, res) => {
    res.send({ hi: "there" });
});
router.post("/signin", requireSignin, signin);
router.post("/signup", userSignupValidator, signup);

module.exports = router;
