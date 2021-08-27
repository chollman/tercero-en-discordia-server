const express = require("express");
const router = express.Router();

require("../services/passport");
const passport = require("passport");

const BlogTag = require("../models/blogTag");

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

router.param("blogTagId", getObjectById(BlogTag, "El tag no existe"));
router.param("userId", userById);

router.get("/blog/tags", getAllObjects(BlogTag));
router.get("/blog/tags/:blogTagId", getObject);
router.post(
    "/blog/tags/:userId",
    requireAuth,
    isAuth,
    isAdmin,
    validateSimpleRequest,
    validateFieldsNotNull(["name"]),
    createObject(BlogTag)
);
router.put(
    "/blog/tags/:blogTagId/:userId",
    requireAuth,
    isAuth,
    isAdmin,
    validateSimpleRequest,
    validateFieldsNotNull(["name"]),
    updateObject
);
router.delete(
    "/blog/tags/:blogTagId/:userId",
    requireAuth,
    isAuth,
    isAdmin,
    deleteObject("El tag se eliminó correctamente")
);

module.exports = router;
