const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");

const userController = require("../controller/user.js");

router.get("/signup", userController.rendersignupform);

router.post("/signup", wrapAsync (userController.signup));

router.get("/login", userController.renderloginform);

router.post("/login",
passport.authenticate("local",{
    failurRedirect:'/login',
    failurFlash: true }),
    userController.login    
 );

router.get("/logout",userController.logout);

module.exports = router;