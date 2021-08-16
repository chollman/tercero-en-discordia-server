const express = require("express");
const router = express.Router();

require("../services/passport");
const passport = require("passport");

const Authentication = require("../controllers/authentication");
const Books = require("../controllers/books");
const { userById } = require("../controllers/user");

const requireAuth = passport.authenticate("jwt", { session: false });

router.param("userId", userById);

// router.get("/books", Books.getAllBooks);
// router.get("/books/:id", Books.getBookById);
router.post("/books/:userId", requireAuth, Authentication.isAuth, Authentication.isAdmin, Books.create);
// router.put("/books/:id", Books.updateBook);
// router.delete("/books/:id", Books.deleteBook);

module.exports = router;
