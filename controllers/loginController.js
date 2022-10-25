// Dependencies
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const passport = require("passport");

//Post Request that handles Register
const registerUser = (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        console.log("Fill empty fields");
    } else {
        //Validation
        User.findOne({ email: email }).then((user) => {
            if (user) {
                console.log("email exists");
                res.render("register", {
                    username,
                    email,
                    password,
                });
            } else {
                //Validation
                const newUser = new User({
                    username,
                    email,
                    password,
                });
                //Password Hashing
                bcrypt.genSalt(10, (err, salt) =>
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser
                            .save()
                            .then(res.redirect("/login"))
                            .catch((err) => console.log(err));
                    })
                );
            }
        });
    }
};

//Logging in Function
const loginUser = (req, res, next) => {
    const { email, password } = req.body;
    //Required
    if (!email || !password) {
        console.log("Please fill in all the fields");
        res.render("login", {
            email,
            password,
        });
    } else {
        passport.authenticate("local", {
            successRedirect: "/dashboard",
            failureRedirect: "/login",
            failureFlash: true,
        })(req, res, next);
    }
};

//Logout user
const logoutUser = (req, res) => {
    req.session.destroy(function (err) {
        req.user = null;
        res.redirect("/dashboard"); //Inside a callback… bulletproof!
    });
};

// For register view
const registerView = (req, res) => {
    res.render("register", {
        user: req.user,
    });
};
// For login view
const loginView = (req, res) => {
    res.render("login", {
        user: req.user,
    });
};

module.exports = {
    loginUser,
    registerUser,
    registerView,
    loginView,
    logoutUser,
};
