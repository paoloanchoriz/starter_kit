var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.model('User', new Schema({
		_id : Number,
		nickName : String,
		firstName : String,
		lastName : String,
		birthDate : Date,
		createDate : { type: Date, default: Date.now },
		email : String,
		contactNumber : String,
		isAdmin : { type: Boolean, default: false }
	})
);

var User = mongoose.model('User', User);

var find = function(searchObj, cb) {
	var that = mongoose.model('User');
	that.findOne(searchObj, function(name, err) {
		cb(name, err);
	});
};

// This will be used for uniqueness
User.statics.findByEmail = function(email, cb) {
	find({ email : email }, cb);
};

// Find user 
User.statics.findById = function(id, cb) {
	find({ _id : id } );
};

module.exports = User;