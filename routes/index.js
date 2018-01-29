const express = require("express");
const basicAuth = require("../auth/basic");
const router = express.Router();

/* GET home page. */
router.get("/", basicAuth.isAuthenticated, (req, res) => {
    res.send("<html><body>Welcome " + req.user.displayName + "</body></html>");
});

module.exports = router;