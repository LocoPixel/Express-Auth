var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    id: String,
    firstname: String,
    lastname: String,
    fullname: String,
    email: String,
    username: String,
    password: String,
    designation: String,
    isActive: Boolean,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    flag: Boolean,
    imgURL: String
});



module.exports = mongoose.model('user', userSchema);