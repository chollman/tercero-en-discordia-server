const express = require("express");
const router = express.Router();
const Authentication = require("./controllers/authentication");
const { userSignupValidator } = require("./validator");
//const Books = require("./controllers/books");
const Category = require("./controllers/category");
require("./services/passport");
const passport = require("passport");

const requireAuth = passport.authenticate("jwt", { session: false });
const requireSignin = passport.authenticate("local", { session: false });

// Authentication
router.get("/", requireAuth, (req, res) => {
    res.send({ hi: "there" });
});
router.post("/signin", requireSignin, Authentication.signin);
router.post("/signup", userSignupValidator, Authentication.signup);

// Categories
//router.get("/category", Category.getAll);
//router.get("/category/:id", Category.getById);
router.post("/category", requireAuth, Category.create);
// router.put("/category/:id", Category.update);
// router.delete("/category/:id", Category.delete);

// Books
// router.get("/books", Books.getAllBooks);
// router.get("/books/:id", Books.getBookById);
// router.post("/books", Books.createBook);
// router.put("/books/:id", Books.updateBook);
// router.delete("/books/:id", Books.deleteBook);

module.exports = router;
