var PasswordStore = require('../../models/passwordStore');
var User = require('../../models/user');

exports.view = function(req, res) {
	if(req.session.uid) res.redirect('/');
	res.render('login', { title : 'Login Page' });
};

exports.submit = function(req, res, next) {
	var user = req.body.user;
	var email = user.email;
	var password = user.password;
	User.authenticate(password, email, function(err, result) {
		if(err) return next(err);
		if(!result) {
			res.error('Invalid email or password');
			res.redirect('back');
			return;
		}

		User.findByEmail(user.email, function(err, user) {
			if(err) return next(err);
			if(!user) {
				res.error('User does not exist in our records');
				res.redirect('back');
				return;
			}

			req.session.uid = user._id;
			req.session.user = user;
			res.redirect('/');
		});
	});
};

exports.logout = function(req, res) {
	req.session.destroy(function(err) {
		if(err) throw err;
		res.redirect('/');
	});
};

exports.validate = function(req, res, next) {
	req.assert('user.email', 'Email is required').isEmpty();
	req.assert('user.password', 'Password is required').isEmpty();

	var errors = req.validationErrors();
	if(errors) {
		handleErrors(res, errors);
		res.redirect('back');
		return;
	}
};