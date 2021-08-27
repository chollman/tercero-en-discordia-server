const express = require("express");
const router = express.Router();

require("../services/passport");
const passport = require("passport");

const Category = require("../models/category");
const Book = require("../models/book");

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
const { validateFieldsNotNull, validateSimpleRequest, validateNoReferences } = require("../helpers/validations");

const requireAuth = passport.authenticate("jwt", { session: false });

router.param("categoryId", getObjectById(Category, "La categoría no existe"));
router.param("userId", userById);

router.get("/categories", getAllObjects(Category));
router.get("/categories/:categoryId", getObject);
router.post(
    "/categories/:userId",
    requireAuth,
    isAuth,
    isAdmin,
    validateSimpleRequest,
    validateFieldsNotNull(["name"]),
    createObject(Category)
);
router.put(
    "/categories/:categoryId/:userId",
    requireAuth,
    isAuth,
    isAdmin,
    validateSimpleRequest,
    validateFieldsNotNull(["name"]),
    updateObject
);
router.delete(
    "/categories/:categoryId/:userId",
    requireAuth,
    isAuth,
    isAdmin,
    validateNoReferences(
        Category,
        "categories",
        Book,
        "No se puede borrar la categoría ya que está referenciando al menos un libro"
    ),
    deleteObject("La categoría se eliminó correctamente")
);

module.exports = router;
