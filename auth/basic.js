const passport = require("passport");
const BasicStrategy = require("passport-http").BasicStrategy;

const authenticate = (username, password, callback) => {
	if (username === "foo" && password === "bar") {
		return callback(null, {
			username: "foo",
			displayName : "The Foo"
		});
	} else {
		return callback(null, false);
	}
};

passport.use(new BasicStrategy(authenticate));

exports.isAuthenticated = passport.authenticate("basic", { session: false });