var mongoose = require('mongoose');
var userProfile = require('../_model/user.model');
var _ = require('lodash');


module.exports = function(passport) {

    var passportJWT = require("passport-jwt");
    var ExtractJwt = passportJWT.ExtractJwt;
    var JwtStrategy = passportJWT.Strategy;

    // Strategy Building
    var jwtOptions = {}
    jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeader();
    jwtOptions.secretOrKey = 'Locopixel';

    var strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
        console.log('payload received', jwt_payload);
        var user = userProfile[_.findIndex(userProfile, { id: jwt_payload.id })];
        if (user) {
            next(null, user);
        } else {
            next(null, false);
        }
    });

    passport.use(strategy);
}