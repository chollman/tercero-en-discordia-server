const express = require("express");
const router = express.Router();

require("../services/passport");
const passport = require("passport");

const { isAuth, isAdmin } = require("../controllers/authentication");
const {
    getAllBooks,
    createBook,
    bookById,
    getBook,
    deleteBook,
    updateBook,
    getCover,
    getBackCover,
    getBooksBySearch,
    getRelatedBooks,
    getCategoriesInUse,
    validateUpsertForm
} = require("../controllers/book");
const { userById } = require("../controllers/user");

const requireAuth = passport.authenticate("jwt", { session: false });

router.get("/books", getAllBooks);
router.get("/books/search", getBooksBySearch);
router.get("/books/categories", getCategoriesInUse);
router.get("/books/related/:bookId", getRelatedBooks);
router.get("/books/:bookId", getBook);
router.post("/books/:userId", requireAuth, isAuth, isAdmin, validateUpsertForm, createBook);
router.put("/books/:bookId/:userId", requireAuth, isAuth, isAdmin, validateUpsertForm, updateBook);
router.delete("/books/:bookId/:userId", requireAuth, isAuth, isAdmin, deleteBook);

router.get("/books/cover/:bookId", getCover);
router.get("/books/backcover/:bookId", getBackCover);

router.param("userId", userById);
router.param("bookId", bookById);

module.exports = router;
