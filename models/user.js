var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
	firstName : String,
	lastName : String,
	displayName : String,
	birthDate : Date,
	createDate : { type: Date, default: Date.now },
	email : String,
	contactNumber : String,
	isAdmin : { type: Boolean, default: false }
});

var find = function(searchObj, cb) {
	var that = mongoose.model('User');
	that.findOne(searchObj, function(user, err) {
		cb(user, err);
	});
};

// This will be used for uniqueness
User.statics.findByEmail = function(email, cb) {
	find({ email : email }, cb);
};

// Find user by Id (Quicker Access?)
User.statics.findById = function(id, cb) {
	find({ _id : id }, cb);
};

// Search functions that uses first name, last name and display name?

mongoose.model('User', User);