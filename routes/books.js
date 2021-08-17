const express = require("express");
const router = express.Router();

require("../services/passport");
const passport = require("passport");

const Authentication = require("../controllers/authentication");
const { getAllBooks, createBook, getById, getBook, deleteBook, updateBook } = require("../controllers/books");
const { userById } = require("../controllers/user");

const requireAuth = passport.authenticate("jwt", { session: false });

router.param("userId", userById);
router.param("bookId", getById);

router.get("/books", getAllBooks);
router.get("/books/:bookId", getBook);
router.post("/books/:userId", requireAuth, Authentication.isAuth, Authentication.isAdmin, createBook);
router.put("/books/:bookId/:userId", requireAuth, Authentication.isAuth, Authentication.isAdmin, updateBook);
router.delete("/books/:bookId/:userId", requireAuth, Authentication.isAuth, Authentication.isAdmin, deleteBook);

module.exports = router;
