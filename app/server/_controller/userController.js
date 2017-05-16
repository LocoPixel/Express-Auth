//Helper
var helperUser = require('../_helper/userHelper');

//Sign Up User Controller
exports.User_postData = function(req, res) {
    return helperUser.CreateUser(req, res);
};

//Sign In User Controller
exports.SignInUser_postData = function(req, res) {
    return helperUser.LoginUser(req, res);
}

//Forget password Controller
exports.ForgetPassword_postData = function(req, res) {
    return helperUser.ForgetPassword(req, res);
}

exports.ResetPassword_postData = function(req, res) {
    return helperUser.ResetPassword(req, res);
}

//Update ResetPassword
exports.UpdatePassword_postData = function(req, res) {
    return helperUser.UpdatePassword(req, res);
}

//Get all usernmae from db
exports.GetallMember_getData = function(req, res) {
    return helperUser.GetAllMember(req, res);
}

//Get personal Info of the Specified User
exports.UploadProfilePic_postData = function(req, res) {
    return helperUser.UploadProfilePic(req, res);
}

//Get All Designation
exports.GetAllDesignation_getData = function(req, res) {
    return helperUser.GetAllDesignation(req, res);
}