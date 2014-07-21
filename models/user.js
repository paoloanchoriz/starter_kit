var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
	_id : Number,
	userName : String,
	firstName : String,
	lastName : String,
	birthDate : Date,
	createDate : { type: Date, default: Date.now },
	email : String,
	contactNumber : String
}, { _id : false });

module.exports = mongoose.model('User', userSchema);