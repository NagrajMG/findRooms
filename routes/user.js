const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");
// signup form, login form, and logout route    
router
    .route("/signup")
    .get( userController.rendersignupForm)
    .post(wrapAsync( userController.signup ));

router
    .route("/login")
    .get( userController.renderLoginForm)
    .post( saveRedirectUrl,
        passport.authenticate("local", {
            failureRedirect: "/login", 
            failureFlash: true,
        }), 
        wrapAsync( userController.login )
    );


router.get("/logout", userController.logout);


module.exports = router;