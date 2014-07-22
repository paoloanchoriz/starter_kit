var redis = require('redis');
var bcrypt = require('bcrypt');
var db = redis.createClient();

// TODO: update password, update email,
// authenticate by email and password
// the key value will be user:email userspecs{ pass, id }
function PasswordStore(specs) {
	this.id = specs.id;
	this.email = specs.email;
	this.pass = specs.pass;
}

PasswordStore.prototype.save = function(fn) {
	if(this.id) {
		this.update(fn);
	} else {
		var user = this;
		// Increments user:ids (this is an entry that keep tracks the latest id)
		db.incr('user:ids', function(err, id) {
			if(err) return fn(err);
			user.id = id;
			// hash user password before updating
			user.hashPassword(function(err) {
				if(err) return fn(err);
				user.update(fn);
			});
		});
	}
};

// TODO: use User prototype methods and statics as basis
// for the remaining PasswordStore methods
User.prototype.update = function(fn) {
	var user = this;
	var id = user.id;
	// This should be replaced with a set?
	// Creates an index entry where the key is user:id:<Name>
	db.set('user:id:' + user.name, id, function(err) {
		if(err) return fn(err);
		// HMSet creates a hash entry using (key:value)
		db.hmset('user:' + id, user, function(err) {
			fn(err, id);
		});
	});
};

// Hashes password using bcrypt
User.prototype.hashPassword = function(fn) {
	var user = this;
	bcrypt.genSalt(12, function(err, salt) { 
		if(err) return fn(err);
		user.salt = salt;
		bcrypt.hash(user.pass, salt, function(err, hash) {
			if(err) return fn(err);
			user.pass = hash;
			fn();
		});
	});
};

// This function gets the user id from the index ex: user:id:Paolo = "1" where "1" is the id of the entry
User.getId = function(name, fn) {
	db.get('user:id:' + name, fn);
};

User.get = function(id, fn) {
	db.hgetall('user:' + id, function(err, user) {
		if(err) return fn(err);
		fn(null, new User(user));
	});
};

User.authenticate = function(name, pass, fn) {
	User.getByName(name, function(err, user) {
		if(err) return fn(err);
		if(!user.id) return fn();
		bcrypt.hash(pass, user.salt, function(err, hash) {
			if(err) return fn(err);
			if(hash === user.pass) return fn(null, user);
			fn();
		});
	});
};

module.exports = User;