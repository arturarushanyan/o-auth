const router = require("express").Router();
const authConfig = require('./auth-config');

router.get("/", function (req, res) {
    res.render("index.ejs");
});

router.get("/login", function (req, res) {
    res.render("login.ejs");
});

router.post("/login", authConfig.localLogin);

router.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
});

router.get("/register", function (req, res) {
    res.render("register.ejs");
});

router.post("/register", authConfig.localRegister);

router.get("/facebook", authConfig.facebookLogin);
router.get("/facebook/callback", authConfig.facebookCallback);

router.get("/profile", checkIfLoggedIn, function (req, res) {
    res.render("profile.ejs", {user: req.user});
});

function checkIfLoggedIn(req, res, next){
    if(req.isAuthenticated){
       return next();
    }
    res.redirect('/login');
}

module.exports = router;