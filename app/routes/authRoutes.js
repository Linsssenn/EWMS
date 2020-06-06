const express = require("express");
const accountController = require("../controllers/account");
const router = express.Router();

router.post("/signup", accountController.signup);
router.post("/login", accountController.login);
router.get("/logout", accountController.logout);

module.exports = router;
