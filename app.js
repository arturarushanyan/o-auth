const express = require("express");
const path = require("path");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const engine = require("ejs-locals");
const passport = require("passport");
const session = require("express-session");
const database = require("./config/database");

const app = express();

app.engine("ejs", engine);
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(session({
    secret: "tank and spank",
    resave: true,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

database.connect();

const routes = require("./config/routes");

app.use(routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get("env") === "development") {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render("error", {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render("error", {
        message: err.message,
        error: {}
    });
});

const port = 1337;
app.listen(port);
console.log("NodeBasicAuth listening on port " + port);
module.exports = app;