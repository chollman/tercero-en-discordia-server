const express = require("express");
const router = express.Router();

require("../services/passport");
const passport = require("passport");

const { isAuth, isAdmin } = require("../controllers/authentication");
const {
    getAllBlogCategories,
    blogCatById,
    createBlogCategory,
    getBlogCategory,
    updateBlogCategory,
    deleteBlogCategory,
} = require("../controllers/blogCategory");
const { userById } = require("../controllers/user");
const { validateFieldsNotNull, validateSimpleRequest } = require("../helpers/validations");

const requireAuth = passport.authenticate("jwt", { session: false });

router.param("blogCategoryId", blogCatById);
router.param("userId", userById);

router.get("/blog/categories", getAllBlogCategories);
router.get("/blog/categories/:blogCategoryId", getBlogCategory);
router.post(
    "/blog/categories/:userId",
    requireAuth,
    isAuth,
    isAdmin,
    validateSimpleRequest,
    validateFieldsNotNull(["name"]),
    createBlogCategory
);
router.put(
    "/blog/categories/:blogCategoryId/:userId",
    requireAuth,
    isAuth,
    isAdmin,
    validateSimpleRequest,
    validateFieldsNotNull(["name"]),
    updateBlogCategory
);
router.delete("/blog/categories/:blogCategoryId/:userId", requireAuth, isAuth, isAdmin, deleteBlogCategory);

module.exports = router;
