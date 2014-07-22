var User = require('../../models/authentication/user');
var MongoUser = require('../../models/user');

// TODO: update routers to use PasswordStore instead of redis User and
// mongoose schema User instead of MongoUser
exports.view = function(req, res) {
	if(req.session.uid) { console.log('Redirecting');res.redirect('/'); }
	res.render('login', { title : 'Login Page' });
};

exports.submit = function(req, res, next) {
	var user = req.body.user;
	User.authenticate(user.name, user.pass, function(err, user) {
		if(err) return next(err);
		if(user) {
			MongoUser.findOne({ _id: user.id }, function(err, mongoUser) {
				req.session.uid = mongoUser._id;
				req.session.user = mongoUser;
				next();
			});
		} else {
			res.error('Invalid Username or Password!');
			res.redirect('back');
		}
	});
};

exports.logout = function(req, res) {
	req.session.destroy(function(err) {
		if(err) throw err;
		res.redirect('/');
	});
};