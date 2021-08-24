const express = require("express");
const router = express.Router();

require("../services/passport");
const passport = require("passport");

const { isAuth, isAdmin } = require("../controllers/authentication");
const {
    getAllAuthors,
    authorById,
    createAuthor,
    updateAuthor,
    deleteAuthor,
    getAuthorPhoto,
    getAuthor,
} = require("../controllers/author");
const { userById } = require("../controllers/user");
const { validateFormStatus, validateFieldsNotNull, validateImage } = require("../helpers/validations");

const requireAuth = passport.authenticate("jwt", { session: false });

router.get("/authors", getAllAuthors);
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
router.delete("/authors/:authorId/:userId", requireAuth, isAuth, isAdmin, deleteAuthor);

router.get("/authors/photo/:authorId", getAuthorPhoto);

router.param("userId", userById);
router.param("authorId", authorById);

module.exports = router;
