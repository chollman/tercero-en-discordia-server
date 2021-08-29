const express = require("express");
const router = express.Router();

require("../services/passport");
const passport = require("passport");

const Author = require("../models/author");
const Book = require("../models/book");

const { isAuth, isAdmin } = require("../controllers/authentication");
const {
    getAllAuthors,
    createAuthor,
    updateAuthor,
    getAuthorPhoto,
    getAuthor,
    getAuthorsBySearch,
} = require("../controllers/author");
const { getObjectById, deleteObject } = require("../controllers/basicController");
const { userById } = require("../controllers/user");
const {
    validateFormStatus,
    validateFieldsNotNull,
    validateImage,
    validateNoReferences,
} = require("../helpers/validations");

const requireAuth = passport.authenticate("jwt", { session: false });

router.param("authorId", getObjectById(Author, "El autor no existe"));
router.param("userId", userById);

router.get("/authors", getAllAuthors);
router.get("/authors/search", getAuthorsBySearch);
router.get("/authors/:authorId", getAuthor);
router.post(
    "/authors/:userId",
    requireAuth,
    isAuth,
    isAdmin,
    validateFormStatus,
    validateFieldsNotNull(["name"], "Debe especificar al menos un nombre"),
    validateImage("photo"),
    createAuthor
);
router.put(
    "/authors/:authorId/:userId",
    requireAuth,
    isAuth,
    isAdmin,
    validateFormStatus,
    validateImage("photo"),
    updateAuthor
);
router.delete(
    "/authors/:authorId/:userId",
    requireAuth,
    isAuth,
    isAdmin,
    validateNoReferences(
        Author,
        "authors",
        Book,
        "No se puede borrar el autor ya que está referenciando al menos un libro"
    ),
    deleteObject("El autor fue borrado correctamente")
);

router.get("/authors/photo/:authorId", getAuthorPhoto);

module.exports = router;
