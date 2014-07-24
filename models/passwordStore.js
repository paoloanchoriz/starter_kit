var redis = require('redis');
var bcrypt = require('bcryptjs');
var db = redis.createClient();

function PasswordStore(specs) {
	this.id = specs.id;
	this.email = specs.email;
	this.pass = specs.pass;
}

PasswordStore.prototype.save = function(fn) {
	var salt = bcrypt.genSaltSync(12);
	this.pass = bcrypt.hashSync(this.pass, salt);
	this.update(fn);
};

PasswordStore.prototype.update = function(fn) {
	var key = 'user:' + this.email;
	db.hmset(key, this, function(err) {
		fn(err)
	});
};

PasswordStore.getByEmail = function(email, fn) {
	db.hgetall('user:' + email, function(err, passwordStore) {
		fn(err, passwordStore);
	});
};

PasswordStore.authenticate = function(user, fn) {
	this.getByEmail(user.email, function(err, passwordStore) {
		console.log(passwordStore);
		if(err) return fn(err);
		if(!passwordStore) return fn();

		bcrypt.compare(user.pass, passwordStore.pass, 
			function(err, result) {
				if(err) return fn(err);

				return fn(err, result);
			}
		);
	});
};
// TODO[PAO]: Create update password function
// TODO[PAO]: Create update email

module.exports = PasswordStore;