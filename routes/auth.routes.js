const express = require("express");
const router = express.Router();
const authController = require("../controller/auth.controller");

router.post("/user/signUp", authController.signUp);
router.post("/user/login", authController.login);
router.get("/user/logout", authController.logOut);

module.exports = router;
