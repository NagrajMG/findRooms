const User = require("../models/user");

// Render the signup form
module.exports.rendersignupForm = (req, res) => { 
    res.render("users/signup.ejs");
};

// Handle user signup
module.exports.signup = async (req, res) => {   
    try {
        // Extract user details from request body
        let { username, email, password } = req.body;

        // Create new user instance with username and email
        const newUser = new User({ email, username });

        // Register the user (password is hashed and stored securely)
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);

        // Log the user in immediately after registration
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to findRooms.com");
            res.redirect("/listings");
        });
    } catch (e) {
        // Handle errors like duplicate usernames or invalid data
        req.flash("error", e.message);
        res.redirect("/signup");
    }  
};

// Render the login form
module.exports.renderLoginForm = (req, res) => { 
    res.render("users/login.ejs");
};

// Handle login
module.exports.login = async (req, res) => {
    req.flash("success", "Welcome to findRooms.com!! You are logged in");

    // Redirect to the originally requested URL or listings page
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

// Handle logout
module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are logged out now");
        res.redirect("/listings");
    });
};
