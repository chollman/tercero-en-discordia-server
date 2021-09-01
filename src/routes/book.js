const express = require("express");
const router = express.Router();

require("../services/passport");
const passport = require("passport");

const Category = require("../models/category");
const Author = require("../models/author");
const Book = require("../models/book");

const { isAuth, isAdmin } = require("../controllers/authentication");
const {
    getAllBooks,
    createBook,
    getBook,
    updateBook,
    getCover,
    getBooksBySearch,
    getRelatedBooks,
    getCategoriesInUse,
} = require("../controllers/book");
const { getObjectById, deleteObject } = require("../controllers/basicController");
const { userById } = require("../controllers/user");
const {
    validateFormStatus,
    validateImage,
    validateFieldsNotNull,
    validateObjectIdArray,
} = require("../helpers/validations");

const requireAuth = passport.authenticate("jwt", { session: false });

router.param("bookId", getObjectById(Book, "El libro no existe"));
router.param("userId", userById);

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
    validateFieldsNotNull(["authors", "title", "categories"], "Debe especificar al menos un título, autor y categoría"),
    validateImage("coverImage"),
    validateImage("backCoverImage"),
    validateObjectIdArray("categories", Category),
    validateObjectIdArray("authors", Author),
    updateBook
);
router.delete(
    "/books/:bookId/:userId",
    requireAuth,
    isAuth,
    isAdmin,
    deleteObject("El libro fue borrado correctamente")
);

router.get("/books/cover/:bookId", getCover("coverImage"));
router.get("/books/backcover/:bookId", getCover("backCoverImage"));

module.exports = router;
