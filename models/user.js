var bcrypt = require('bcryptjs');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;

var User = new Schema({
	firstName : String,
	lastName : String,
	displayName : String,
	birthDate : Date,
	createDate : { type: Date, default: Date.now },
	email : String,
	contactNumber : String,
	password : String,
	isAdmin : { type: Boolean, default: false }
});

var find = function(that, searchObj, cb) {
	that.findOne(searchObj, { password : 0 }, function(err, user) {
		cb(err, user);
	});
};

var deletePassword = function(user, err, cb) {
	if(user) delete user.password;
	cb(err, user);
};

var hashPassword = function(password) {
	var salt = bcrypt.genSaltSync(12);
	return bcrypt.hashSync(password, salt);
};

var updateById = function(that, id, updateValue, cb) {
	that.findByIdAndUpdate(new ObjectId(id), updateValue, function(err, user) {
		deletePassword(user, err, cb);
	});
};

// Hashes the password before saving
User.methods.saveCredentials = function(cb) {
	this.password = hashPassword(this.password);
	this.save(function(err, user) {
		user = user.toObject();
		deletePassword(user, err, cb);
	});
};

// This will be called after password is validated
// Update password and passes updated user
User.statics.updatePassword = function(newPass, id, cb) {
	newPass = hashPassword(newPass);
	updateById(this, id, { password : newPass }, cb);
};

// This will be called after password is validated.
// Update display name and passes updated user
User.statics.updateDisplayName = function(newDisplayName, id, cb) {
	updateById(this, id, { displayName : newDisplayName }, cb);
};

// This will be used for uniqueness
User.statics.findByEmail = function(email, cb) {
	find(this, { email: email }, cb);
};

User.statics.authenticate = function(password, email, cb) {
	this.findOne({ email : email }, { password : 1, _id : 0 }, 
		{ lean : true }, function(err, user) {
		if(err) return cb(err)
		bcrypt.compare(password, user.password, function(err, result) {
			return cb(err, result);
		})
	});
};

User.statics.matchPassword = function(id, password, cb) {
	this.findById(id, { password : 1, _id: 0}, function(err, user) {
		if(err) return cb(err);
		bcrypt.compare(password, user.password, function(err, result) {
			return cb(err, result);
		});
	})
}
// TODO[PAO]: Search functions that uses first name, 
// last name and display name?
// Future implementation

module.exports = mongoose.model('User', User);