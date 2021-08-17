const express = require("express");
const router = express.Router();

require("../services/passport");
const passport = require("passport");

const Authentication = require("../controllers/authentication");
const { createBook, getById, getBook, deleteBook } = require("../controllers/books");
const { userById } = require("../controllers/user");

const requireAuth = passport.authenticate("jwt", { session: false });

router.param("userId", userById);
router.param("bookId", getById);

// router.get("/books", Books.getAllBooks);
router.get("/books/:bookId", requireAuth, Authentication.isAuth, Authentication.isAdmin, getBook);
router.post("/books/:userId", requireAuth, Authentication.isAuth, Authentication.isAdmin, createBook);
// router.put("/books/:id", Books.updateBook);
router.delete("/books/:bookId/:userId", requireAuth, Authentication.isAuth, Authentication.isAdmin, deleteBook);

module.exports = router;
