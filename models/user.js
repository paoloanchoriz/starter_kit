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
		cb(err, user);
	});
};

// This will be used for uniqueness
User.statics.findByEmail = function(email, cb) {
	find(this, { email: email }, cb);
};

// Find user by Id (Used for retrieving using other users)
User.statics.findById = function(id, cb) {
	find(this, { _id : id }, cb);
};

// TODO[PAO]: Search functions that uses first name, 
// last name and display name?
// Future implementation

module.exports = mongoose.model('User', User);