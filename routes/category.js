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

router.get("/category", getAllCategories);
router.get("/category/:categoryId", getCategory);
router.post("/category/:userId", requireAuth, Authentication.isAuth, Authentication.isAdmin, createCategory);
router.put("/category/:categoryId/:userId", requireAuth, Authentication.isAuth, Authentication.isAdmin, updateCategory);
router.delete(
    "/category/:categoryId/:userId",
    requireAuth,
    Authentication.isAuth,
    Authentication.isAdmin,
    deleteCategory
);

module.exports = router;
