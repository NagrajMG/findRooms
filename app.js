// Load environment variables from .env in non-production environments
if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}

// Import core and third-party modules
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");

// Import route handlers
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// MongoDB connection URI from environment
const dbUrl = process.env.MONGODB_KEY;

// Secret for session encryption
const SECRET = process.env.SECRET;

// Connect to MongoDB using Mongoose
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
    await mongoose.connect(dbUrl);
}

// Set EJS as the templating engine and views directory
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Set EJS-Mate as the template engine to support layouts/partials
app.engine("ejs", ejsMate);

// Middleware to parse form data, support PUT/DELETE via method override, and serve static files
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

// Configure MongoDB session store using connect-mongo
const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: SECRET,
    },
    touchAfter: 24 * 3600, // Prevents resaving unchanged session data more than once every 24 hrs
});

// Log error if session store setup fails
store.on("error", () => {
    console.log("ERROR in MONGO SESSION STORE", err);
});

// Session configuration object
const sessionOptions = {
    store,
    secret: SECRET,
    resave: false,
    saveUninitialized: true,
};

// Use session and flash middleware
app.use(session(sessionOptions));
app.use(flash());

// Initialize Passport.js for authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware to make flash messages and current user available in all templates
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;    // Automatically set by passport
    next();
});

// Mount routers for listings, reviews, and user authentication
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);
app.get("/privacy", (req,res) => {
    req.flash("error",`Under development stage! Please co-operate with us, Dear ${res.locals.currUser.username || "Guest"}:)`);
    res.redirect("/listings");
});
app.get("/terms", (req, res) => {
    req.flash("error",`Under development stage! Please co-operate with us, Dear ${res.locals.currUser.username || "Guest"}:)`);
    res.redirect("/listings");
});

// Handle all undefined routes 
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found!!"));
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "something went wrong" } = err;
    res.status(statusCode).send(message);
});

// Start the server
app.listen(process.env.PORT, () => {
    console.log(`server is listening to port ${process.env.PORT}`);
});
