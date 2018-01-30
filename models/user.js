const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const Schema = mongoose.Schema;

const User = new Schema({
   local: {
       email: String,
       password: String
   },
    facebook: {
        id: String,
        token: String,
        email: String
    }
});

User.methods.hashPassword = function(pass) {
    return bcrypt.hashSync(pass, bcrypt.genSaltSync());
};

//using es5 syntax because of arrow function's 'this'
User.methods.validatePassword = function(pass) {
    return bcrypt.compareSync(pass, this.local.password);
};

module.exports = mongoose.model('user', User);