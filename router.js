const express = require("express");
const router = express.Router();
const Authentication = require("./controllers/authentication");
const Book = require("./controllers/book");
require("./services/passport");
const passport = require("passport");

const requireAuth = passport.authenticate("jwt", { session: false });
const requireSignin = passport.authenticate("local", { session: false });

// Authentication
router.get("/", requireAuth, (req, res) => {
    res.send({ hi: "there" });
});
router.post("/signin", requireSignin, Authentication.signin);
router.post("/signup", Authentication.signup);

// Book
router.get("/Book", Book.getAllBooks);
router.get("/Book/:id", Book.read);
router.post("/Book", Book.createBook);
router.put("/Book/:id", Book.updateBook);
router.delete("/Book/:id", Book.deleteBook);

router.param(":id", Book.getBookById);

module.exports = router;
