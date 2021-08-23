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
} = require("../controllers/author");
const { userById } = require("../controllers/user");

const requireAuth = passport.authenticate("jwt", { session: false });

router.get("/authors", getAllAuthors);
router.get("/authors/:authorId");
router.post("/authors/:userId", requireAuth, isAuth, isAdmin, createAuthor);
router.put("/authors/:authorId/:userId", requireAuth, isAuth, isAdmin, updateAuthor);
router.delete("/authors/:authorId/:userId", requireAuth, isAuth, isAdmin, deleteAuthor);

router.get("/authors/photo/:authorId", getAuthorPhoto);

router.param("userId", userById);
router.param("bookId", authorById);

module.exports = router;
