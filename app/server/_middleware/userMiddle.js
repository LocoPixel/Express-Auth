// Valid user upon Sign Up
exports.validUser = function(req, res, next) {

    var user = req.body;
    var Exp = /^[A-Za-z ]+$/;
    var num = /^[0-9]+$/;
    var pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

    if (!user.full_name || !user.full_name.match(Exp)) {
        return res.json({ status: "Fail", message: "Full name is required and must be in alpha characters" });
    }

    if (!user.email) {
        return res.json({ status: "Fail", message: "Email is required " });
    }
    // if (!user.email.match(pattern)) {
    //     return res.json({ status: "Fail", message: "Please correct Your Email" });
    // }

    if (!user.password) {
        return res.json({ status: "Fail", message: "Password is required and must must have atleast 8 characters" });
    }
    if (user.password.length < 8) {
        return res.json({ status: "Fail", message: "Password has minimum of 8 characters" });
    }
    if (user.password.indexOf(' ') >= 0) {
        return res.json({ status: "Fail", message: "Password should not contain empty spaces" });
    }


    if (!user.designation) {
        return res.json({ status: "Fail", message: "Designation is required" });
    }
    next();
}

// Valid credentials upeon sign in
exports.SignInValiduser = function(req, res, next) {
    var user = req.body;
    var Exp = /^[A-Za-z ]+$/;
    var pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

    if (!user.email) {
        return res.json({ status: "Fail", message: "Email is required" });
    }
    // if (!user.email.match(pattern)) {
    //     return res.json({ status: "Fail", message: "Please correct Your Email" });
    // }
    if (!user.password) {
        return res.json({ status: "Fail", message: "Password is required" });
    }
    next();
}

// Valid Email upon Forget Password
exports.ForgetPassword = function(req, res, next) {
    var user = req.body;
    var Exp = /^[A-Za-z ]+$/;
    var pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    if (!user.email) {
        return res.json({ status: "Fail", message: "Email is required and must be in alpha characters" });
    }
    // if (!user.email.match(pattern)) {
    //     return res.json({ status: "Fail", message: "Please correct Your Email" });
    // }

    next();
}

//Reset Password
exports.ResetPassword = function(req, res, next) {;
    if (!req.params.token) {
        return res.json({ status: "Fail", message: "Token has been expired" });
    }

    next();
}

//Update Password
exports.UpdatePassword = function(req, res, next) {
    if (!req.body.new_password) {
        return res.json({ status: "Fail", error: "New Password field is empty" });
    }
    if (!req.body.confirm_Password) {
        return res.json({ status: "Fail", error: "Confirm Password field is empty" });
    }
    if (req.body.new_password != req.body.confirm_Password) {
        return res.json({ status: "Fail", error: "New Password and Confirm Password were not matched" });
    }
    next();
}

//Get all Username from db
exports.GetAllMembers = function(req, res, next) {
    next();
}

//Get Personal Info of the Specific User
exports.UploadProfilePic = function(req, res, next) {
    next();
}