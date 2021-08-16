const express = require("express");
const router = express.Router();

require("../services/passport");
const passport = require("passport");

const Authentication = require("../controllers/authentication");
const Category = require("../controllers/category");
const { userById } = require("../controllers/user");

const requireAuth = passport.authenticate("jwt", { session: false });

router.param("userId", userById);

//router.get("/category", Category.getAll);
//router.get("/category/:id", Category.getById);
router.post("/category/:userId", requireAuth, Authentication.isAuth, Authentication.isAdmin, Category.create);
// router.put("/category/:id", Category.update);
// router.delete("/category/:id", Category.delete);

module.exports = router;
