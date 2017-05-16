const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

//Passport Include
var passport = require('../config/passport');

//Middleware
var UserMiddleware = require('../_middleware/userMiddle');
//Controller
var UserController = require('../_controller/userController');

// Sign Up User
router.post('/', UserMiddleware.validUser, UserController.User_postData);

// Login / Sign In User
router.post("/login", UserMiddleware.SignInValiduser, UserController.SignInUser_postData);

//Forget Password
router.post("/forget", UserMiddleware.ForgetPassword, UserController.ForgetPassword_postData);

//Reset Password
router.get("/reset/:token", UserMiddleware.ResetPassword, UserController.ResetPassword_postData);

//Save UpdatePassword
router.post("/updatePass", UserMiddleware.UpdatePassword, UserController.UpdatePassword_postData);

//Get all username from database
router.get('/getuser', UserMiddleware.GetAllMembers, UserController.GetallMember_getData);

//Get Personal info of the User
router.post('/uploadprofilepic/:userid', UserMiddleware.UploadProfilePic, UserController.UploadProfilePic_postData);

//Get all designation from db
router.get('/getallDesignation', UserController.GetAllDesignation_getData);

//Test Api
router.get('/test', function(req, res) {
    res.status(200).json({ message: "Its Working", datetime: Date.now() });
});

module.exports = router;