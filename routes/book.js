const express = require("express");
const router = express.Router();

require("../services/passport");
const passport = require("passport");

const Category = require("../models/category");
const Author = require("../models/author");

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
} = require("../controllers/book");
const { userById } = require("../controllers/user");
const {
    validateFormStatus,
    validateImage,
    validateFieldsNotNull,
    validateObjectIdArray,
} = require("../helpers/validations");

const requireAuth = passport.authenticate("jwt", { session: false });

router.get("/books", getAllBooks);
router.get("/books/search", getBooksBySearch);
router.get("/books/categories", getCategoriesInUse);
router.get("/books/related/:bookId", getRelatedBooks);
router.get("/books/:bookId", getBook);
router.post(
    "/books/:userId",
    requireAuth,
    isAuth,
    isAdmin,
    validateFormStatus,
    validateFieldsNotNull(["authors", "title", "categories"], "Debe especificar al menos un título, autor y categoría"),
    validateImage("coverImage"),
    validateImage("backCoverImage"),
    validateObjectIdArray("categories", Category),
    validateObjectIdArray("authors", Author),
    createBook
);
router.put(
    "/books/:bookId/:userId",
    requireAuth,
    isAuth,
    isAdmin,
    validateFormStatus,
    validateImage("coverImage"),
    validateImage("backCoverImage"),
    validateObjectIdArray("categories", Category),
    validateObjectIdArray("authors", Author),
    updateBook
);
router.delete("/books/:bookId/:userId", requireAuth, isAuth, isAdmin, deleteBook);

router.get("/books/cover/:bookId", getCover);
router.get("/books/backcover/:bookId", getBackCover);

router.param("userId", userById);
router.param("bookId", bookById);

module.exports = router;
