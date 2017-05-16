//Password encryption
const bcrypt = require('bcryptjs');

//Model
var userProfile = require('../_model/user.model');
var designationProfile = require('../_model/designation.model');

//middleware
var userMiddleware = require('../_middleware/userMiddle');

//Async call
var async = require('async');

//Crypto to make token for password Reset
var crypto = require('crypto');

//Node mailer to send email
var nodemailer = require('nodemailer');

// Gamil NPM
var send = require('gmail-send');

//Json Web Token
var jwt = require('jsonwebtoken');
var passport = require("../config/passport");
var passportJWT = require("passport-jwt");
var ExtractJwt = passportJWT.ExtractJwt;
var jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeader();
jwtOptions.secretOrKey = 'Locopixel';

//Queue URL for Users
var queueURL = 'https://sqs.us-west-2.amazonaws.com/056912719017/lsm-user-sqs';

// Create User
exports.CreateUser = function(req, res) {
    let user = new userProfile();
    user.fullname = req.body.full_name;
    let nameArr = req.body.full_name.split(" ");
    user.firstname = nameArr[0];
    user.lastname = nameArr[nameArr.length - 1];
    user.email = req.body.email;
    user.username = req.body.email;
    user.password = generateHash(req.body.password);
    user.designation = req.body.designation.designation;
    user.isActive = true;
    user.flag = false;
    user.imgURL = 'https://lsm-images.s3.amazonaws.com/8e305ba4-9b78-4927-9fb3-987b44592bb3.jpg';

    var query = userProfile.find({ 'email': req.body.email }).exec();
    query.then(function(user1) {
            if (user1.length != 0) {
                res.json({ status: "Fail", message: "Email has already been taken", STATUS: false, MESSAGE: "Email has already been taken" });
            } else {
                return user.save(function(err) {
                    if (err) {
                        throw (err)
                    } else {
                        res.json({ status: "OK", message: "User has been Created", STATUS: true, MESSAGE: "User has been Created" });
                        //AWS SQS Implementation
                        var AWS = require('aws-sdk');
                        AWS.config.update({ accessKeyId: process.env.AWS_ACCESS_KEY, secretAccessKey: process.env.AWS_SECRET_KEY });
                        var sqs = new AWS.SQS({ region: 'eu-west-1' });
                        var msg = { name: user.fullname, ImgURL: user.imgURL, userID: user._id };
                        var sqsParams = { MessageBody: JSON.stringify(msg), QueueUrl: queueURL };
                        sqs.sendMessage(sqsParams, function(err, data) {
                            if (err) { throw err }
                            // console.log(data);
                        });
                        // AWS SQS End
                    }
                });
            }
        })
        .catch(function(err) {});
}

function generateHash(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

//Login User
exports.LoginUser = function(req, res) {

    if (req.body.email && req.body.password) {
        var email = req.body.email;
        var password = req.body.password;
    }

    var query = userProfile.findOne({ 'email': req.body.email }).exec();
    query.then(function(user1) {
            if (user1.length != 0) {
                return user1;
            } else {
                res.json({ error: "Incorrect email and password", STATUS: false, MESSAGE: "Incorrect email and password" });
            }
        })
        .then(function(user1) {
            var _isPass = validPassword(req.body.password, user1.password);
            if (_isPass == true) {
                var payload = { id: user1._id };
                var token = "JWT " + jwt.sign(payload, jwtOptions.secretOrKey);
                res.json({ message: "ok", token: token, UserId: user1._id, UserName: user1.firstname, UserInfo: user1, STATUS: true, MESSAGE: "OK" });
            } else {
                res.json({ error: "Incorrect email and password", STATUS: false, MESSAGE: "Incorrect email and password" });
            }

        })
        .catch(function(err) {
            res.json({ error: "Incorrect email and password", STATUS: false, MESSAGE: "Incorrect email and password" });
        });
}

function validPassword(canpassword, dbpassword) {
    return bcrypt.compareSync(canpassword, dbpassword);
}

//forget Password
exports.ForgetPassword = function(req, res, next) {
    async.waterfall([
            function(done) {
                crypto.randomBytes(20, function(err, buf) {
                    var token = buf.toString('hex');
                    done(err, token);
                });
            },
            function(token, done) {
                userProfile.findOne({ email: req.body.email }, function(err, user) {
                    if (!user) {
                        res.json({ error: "No account with that email address exists.", status: "Fail", STATUS: false, MESSAGE: "No account with that email address exists." });
                    } else {
                        user.resetPasswordToken = token;
                        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                        user.save(function(err) {
                            done(err, token, user);
                        });
                    }
                });
            },
            function(token, user, done) {
                if (!user) {
                    res.json({ error: "No account with that email address exists.", status: "Fail", STATUS: false, MESSAGE: "No account with that email address exists." });
                } else {
                    var smtpTransport = nodemailer.createTransport({
                        host: "smtp.gmail.com",
                        secureConnection: true,
                        port: 465,
                        auth: {
                            user: "test.test6772@gmail.com",
                            pass: "Locopixel@123"
                        }
                    });

                    var mailOptions = {
                        to: user.email,
                        from: '<no-reply@iamrohit.in>',
                        subject: 'Password Reset',
                        html: '<b>Hi ' + user.fullname + '</b><p>You recently requested to reset your password for your account with Email : ' + user.email + '</p>' +
                            '<a href=' + 'http://lsm-lb-1481639842.us-west-2.elb.amazonaws.com/api/user/reset/' + token + '>Reset Password</a>'
                    };
                    smtpTransport.sendMail(mailOptions, function(err) {
                        res.json({ Success: "An e-mail has been sent to " + user.email + " with further instructions.", status: "Success", STATUS: true, MESSAGE: "An e-mail has been sent to " + user.email + " with further instructions." });
                        done(err, 'done');
                    });
                }
            }
        ],
        function(err) {
            if (err) {
                throw err
            } else { res.json({ error: "Incorrect email", Issue: err, STATUS: false, MESSAGE: "Incorrect email" }); }
        });
}

//Reset Password
exports.ResetPassword = function(req, res, next) {
    // console.log("Token is : " + req.params.token);
    userProfile.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
            res.json({ error: "Password reset token is invalid or has expired.", STATUS: false, MESSAGE: "Password reset token is invalid or has expired." });
        } else {
            res.redirect('http://lsm-lb-1481639842.us-west-2.elb.amazonaws.com/auth/resetpass/' + req.params.token);
        }
    });
}

//update Password
exports.UpdatePassword = function(req, res, next) {
    userProfile.findOne({ resetPasswordToken: req.body.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
            res.json({ error: "Password reset token is invalid or has expired.", STATUS: false, MESSAGE: "Password reset token is invalid or has expired." });
        } else {
            user.password = generateHash(req.body.new_password);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save(function(err) {
                if (err) {
                    res.json({ error: "Session Time Out please try again.", STATUS: false, MESSAGE: "Session Time Out please try again." });
                } else {
                    res.json({ Status: "Updated", Message: "Password has been changes Successfully.", STATUS: true, MESSAGE: "Password has been changed Successfully." });
                }
            });
        }
    });
}

//Get all username from db
exports.GetAllMember = function(req, res) {
    userProfile.find(function(err, data) {
        if (err) {
            throw err;
        } else {
            res.json({ status: "OK", memberData: data, STATUS: true, MESSAGE: "Member data successfully Received" });
        }
    });
};

// Upload profile Picture
exports.UploadProfilePic = function(req, res) {
    userProfile.findOne({ _id: req.params.userid }, function(err, user) {
        if (!user) {
            res.json({ error: "Unable to change Profile Pic", STATUS: false, MESSAGE: "Unable to change Profile Pic" });
        } else {
            req.file('file').upload({
                adapter: require('skipper-s3'),
                key: process.env.ACCESS_KEY,
                secret: process.env.SECRET_KEY,
                bucket: process.env.BUCKET_NAME,
                headers: {
                    ContentType: 'image/png',
                    'x-amz-acl': 'public-read'
                }
            }, function whenDone(err, uploadedFiles) {
                if (err) {
                    return res.json(err);
                } else {
                    let files = uploadedFiles;
                    user.imgURL = files[0].extra.Location;
                    user.save(function(err) {
                        if (err) {
                            res.json({ error: "Unable to change Profile Pic", STATUS: false, MESSAGE: "Unable to change Profile Pic" });
                        } else {
                            res.json({ Status: "OK", Message: "Profile Picture has been changed", ProfilePicURL: user.imgURL, STATUS: true, MESSAGE: "Profile Picture has been changed" });
                        }
                    });
                }
            });
        }
    });
}

//All Designation from DB
exports.GetAllDesignation = function(req, res) {
    designationProfile.find(function(err, data) {
        if (err) {
            throw err;
        } else {
            if (data.length == 0) {
                res.json({ STATUS: false, MESSAGE: "No Designations Found" });
            } else {
                res.json({ status: "OK", designationNames: data, STATUS: true, MESSAGE: "Designations successfully Received" });
            }
        }
    });
}