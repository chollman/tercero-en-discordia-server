const express = require("express");
const router = express.Router();

require("../services/passport");
const passport = require("passport");

const Authentication = require("../controllers/authentication");
const {
    getAllCategories,
    catById,
    createCategory,
    getCategory,
    updateCategory,
    deleteCategory,
} = require("../controllers/category");
const { userById } = require("../controllers/user");

const requireAuth = passport.authenticate("jwt", { session: false });

router.param("categoryId", catById);
router.param("userId", userById);

router.get("/categories", getAllCategories);
router.get("/categories/:categoryId", getCategory);
router.post("/categories/:userId", requireAuth, Authentication.isAuth, Authentication.isAdmin, createCategory);
router.put(
    "/categories/:categoryId/:userId",
    requireAuth,
    Authentication.isAuth,
    Authentication.isAdmin,
    updateCategory
);
router.delete(
    "/categories/:categoryId/:userId",
    requireAuth,
    Authentication.isAuth,
    Authentication.isAdmin,
    deleteCategory
);

module.exports = router;
