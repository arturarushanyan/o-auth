const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/user');

const faceBookConfig = {
    clientID: 2015570975325658,
    clientSecret: '656fed37938d158da5c5152a9b21d628',
    callbackURL: 'http://localhost:1337/facebook/callback',
    profileFields: ['id', 'emails', 'name']
};

//user access token EAAcpJrAAZCdoBAN7BZCl9ZAnPMnytqiAgMS5JKEetneJcnKzlxuGXouvdyscSo4EGPZBwc0n04WQ5UKUaRfZAsFGpUnN23LzkSZA0emEPiPmamvPx3KMePUGp41mEo9rYKV6q0qEhv0XWujNKoV78BO5wvWScAXC1qk1MuyEkuJemj8fBH9jHNi1CatZBZBIHPJ5HhERzeUVTW9vtx8LaMDN
const localRegisterInit = (req, email, password, callback) => {
    User.findOne({'local.email': email}, (err, user) => {
        if(err) callback(err);
        if(user){
            //TODO: SUPPLY MSG
            return callback(null, false);
        }

        let newUser = new User();
        newUser.local.email = email;
        newUser.local.password = newUser.hashPassword(password);

        newUser.save((err) => {
            if (err) throw err;
            return callback(null, newUser);
        })
    })
};

const localLoginInit = (req, email, password, callback) => {
    User.findOne({'local.email': email}, (err, user) => {
        if(err) callback(err);
        if(!user || !user.validatePassword(password)){
            //TODO: SUPPLY generic MSG
            return callback(null, false);
        }

        return callback(null, user);
    })
};

const localOptions = {
    usernameField: "emailAddress",
    passwordField: "password",
    passReqToCallback: true
};

const facebookInit = (token, refreshToken, profile, callback) => {
    User.findOne({'facebookId': profile.id}, (err, user) => {
        if (err) return callback(err);
        if(user){
            return callback(null, user);
        }
        let newUser = new User();
        newUser.facebook.id = profile.id;
        newUser.facebook.token = token;
        newUser.facebook.email = profile.emails[0].value;

        newUser.save((err) => {
            if (err) throw err;
            return callback(null, newUser);
        })

    });
};

passport.use('local-register', new LocalStrategy(localOptions, localRegisterInit));
passport.use('local-login', new LocalStrategy(localOptions, localLoginInit));
passport.use(new FacebookStrategy(faceBookConfig, facebookInit));

passport.serializeUser((user, callback) => {
    callback(null, user.id);
});

passport.deserializeUser((id, callback) => {
    User.findById(id, (err, user) => {
        callback(err, user);
    })
});

module.exports = {
    localRegister: passport.authenticate('local-register', {
        successRedirect: '/profile',
        failureRedirect: '/register'
    }),
    localLogin: passport.authenticate('local-login', {
        successRedirect: '/profile',
        failureRedirect: '/login'
    }),
    facebookLogin: passport.authenticate('facebook', {scope: ['email']}),
    facebookCallback: passport.authenticate('facebook', {
        successRedirect: '/profile',
        failureRedirect: '/login'
    })
};