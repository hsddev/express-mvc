// Dependencies
const express = require("express");
const {
    registerView,
    loginView,
    registerUser,
    loginUser,
    logoutUser,
} = require("../controllers/loginController");
const router = express.Router();
const { protectRoute } = require("../auth/protect");
const { dashboardView } = require("../controllers/dashboardController");

router.get("/register", registerView);
router.get("/login", loginView);
router.get("/dashboard", protectRoute, dashboardView);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);

module.exports = router;
