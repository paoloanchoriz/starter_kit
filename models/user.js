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

var find = function(that, searchObj, cb) {
	that.findOne(searchObj, function(err, user) {
		cb(user, err);
	});
};

// This will be used for uniqueness
User.statics.findByEmail = function(email, cb) {
	find(this, { email: email }, cb);
};

// Find user by Id (Quicker Access?)
User.statics.findById = function(id, cb) {
	find(this, { _id : id }, cb);
};

// Search functions that uses first name, last name and display name?

module.exports = mongoose.model('User', User);