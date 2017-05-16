var mongoose = require('mongoose');

// module.exports = mongoose.connect('mongodb://127.0.0.1:27017/lsm_auth');

module.exports = mongoose.connect('mongodb://ec2-34-209-206-172.us-west-2.compute.amazonaws.com:27017/lsm_auth');