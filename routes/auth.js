const express = require("express");
const router = express.Router();

const { userSignupValidator } = require("../validator");
require("../services/passport");
const passport = require("passport");

const Authentication = require("../controllers/authentication");

const requireAuth = passport.authenticate("jwt", { session: false });
const requireSignin = passport.authenticate("local", { session: false });

router.get("/", requireAuth, (req, res) => {
    res.send({ hi: "there" });
});
router.post("/signin", requireSignin, Authentication.signin);
router.post("/signup", userSignupValidator, Authentication.signup);

module.exports = router;
