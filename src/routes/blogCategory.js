const express = require("express");
const router = express.Router();

require("../services/passport");
const passport = require("passport");

const BlogCategory = require("../models/blogCategory");

const { isAuth, isAdmin } = require("../controllers/authentication");
const {
    getAllObjects,
    getObjectById,
    getObject,
    createObject,
    updateObject,
    deleteObject,
} = require("../controllers/basicController");
const { userById } = require("../controllers/user");
const { validateFieldsNotNull, validateSimpleRequest } = require("../helpers/validations");

const requireAuth = passport.authenticate("jwt", { session: false });

router.param("blogCategoryId", getObjectById(BlogCategory, "La categoría de Blog no existe"));
router.param("userId", userById);

router.get("/blog/categories", getAllObjects(BlogCategory));
router.get("/blog/categories/:blogCategoryId", getObject);
router.post(
    "/blog/categories/:userId",
    requireAuth,
    isAuth,
    isAdmin,
    validateSimpleRequest,
    validateFieldsNotNull(["name"]),
    createObject(BlogCategory)
);
router.put(
    "/blog/categories/:blogCategoryId/:userId",
    requireAuth,
    isAuth,
    isAdmin,
    validateSimpleRequest,
    validateFieldsNotNull(["name"]),
    updateObject
);
router.delete(
    "/blog/categories/:blogCategoryId/:userId",
    requireAuth,
    isAuth,
    isAdmin,
    deleteObject("La categoría de Blog se eliminó correctamente")
);

module.exports = router;
