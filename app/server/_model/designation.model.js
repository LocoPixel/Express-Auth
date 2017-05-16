var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var designationSchema = new Schema({
    id: String,
    designation: String
});



module.exports = mongoose.model('designation', designationSchema);