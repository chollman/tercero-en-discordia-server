const express = require("express");
const router = express.Router();

require("../services/passport");
const passport = require("passport");

const BlogPost = require("../models/blogPost");
const BlogCategory = require("../models/blogCategory");
const BlogTag = require("../models/blogTag");

const { isAuth, isAdmin } = require("../controllers/authentication");
const { getAllBlogPosts, getBlogPost, createBlogPost, updateBlogPost } = require("../controllers/blogPost");
const { getObjectById, deleteObject } = require("../controllers/basicController");
const { userById } = require("../controllers/user");
const {
    validateNullArrays,
    validateFieldsNotNull,
    validateFormStatus,
    validateNullableObjectIdArray,
    validateArrayHasNoEmptyStrings,
} = require("../helpers/validations");

const requireAuth = passport.authenticate("jwt", { session: false });

router.param("blogPostId", getObjectById(BlogPost, "El Blog post no existe"));
router.param("userId", userById);

router.get("/blog/posts", getAllBlogPosts);
router.get("/blog/posts/:blogPostId", getBlogPost);
router.post(
    "/blog/posts/:userId",
    requireAuth,
    isAuth,
    isAdmin,
    validateFormStatus,
    validateNullArrays(["categories", "tags", "comments"]),
    validateArrayHasNoEmptyStrings("comments"),
    validateFieldsNotNull(["title"]),
    validateNullableObjectIdArray("categories", BlogCategory),
    validateNullableObjectIdArray("tags", BlogTag),
    createBlogPost
);
router.put(
    "/blog/posts/:blogPostId/:userId",
    requireAuth,
    isAuth,
    isAdmin,
    validateFormStatus,
    validateNullArrays(["categories", "tags", "comments"]),
    validateArrayHasNoEmptyStrings("comments"),
    validateFieldsNotNull(["title"]),
    validateNullableObjectIdArray("categories", BlogCategory),
    validateNullableObjectIdArray("tags", BlogTag),
    updateBlogPost
);
router.delete(
    "/blog/posts/:blogPostId/:userId",
    requireAuth,
    isAuth,
    isAdmin,
    deleteObject("El Blog Post se eliminó correctamente")
);

module.exports = router;
