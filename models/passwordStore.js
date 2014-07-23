var redis = require('redis');
var bcrypt = require('bcrypt');
var db = redis.createClient();

TODO: update password, update email,
authenticate by email and password
the key value will be user:email userspecs{ pass, id, salt }
function PasswordStore(specs) {
	this.id = specs.id;
	this.email = specs.email;
	this.pass = specs.pass;
}

var hashPassword = function(password, salt) {
	return bcryt.hashSync(password, salt);
};

PasswordStore.prototype.save = function(fn) {
	if(this.id) {
		this.update(fn);
	} else {
		var salt = bcrypt.getSaltSync(12);
		this.pass = hashPassword(this.pass, salt);
		this.salt = salt;
		this.update(fn);
	}
};

User.prototype.update = function(fn) {
	var key = 'user:' + this.email;
	db.hmset(key, this, function(err) {
		fn(err)
	});
};

// TODO[PAO]: Create update email function
// TODO[PAO]: Create update password function
// TODO[PAO]: Create static get by email
// TODO[PAO]: Create static authenticate

// User.authenticate = function(name, pass, fn) {
// 	User.getByName(name, function(err, user) {
// 		if(err) return fn(err);
// 		if(!user.id) return fn();
// 		bcrypt.hash(pass, user.salt, function(err, hash) {
// 			if(err) return fn(err);
// 			if(hash === user.pass) return fn(null, user);
// 			fn();
// 		});
// 	});
// };


// User.get = function(id, fn) {
// 	db.hgetall('user:' + id, function(err, user) {
// 		if(err) return fn(err);
// 		fn(null, new User(user));
// 	});
// };



//module.exports = User;