// Dependencies
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const passport = require("passport");
const { loginCheck } = require("./auth/passport");
const session = require("express-session");
loginCheck(passport);

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = new express();

app.use(
    session({
        secret: "oneboy",
        saveUninitialized: true,
        resave: true,
    })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: false }));

// Mongodb connection
const database = process.env.MONGOLAB_URL;
mongoose
    .connect(database, { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => console.log("Successfully connected !"))
    .catch((err) => console.log(err));

app.use("/", require("./routes/login"));

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Start the server
app.listen(PORT, () => {
    console.log(`Start listening on port ${PORT}`);
});
