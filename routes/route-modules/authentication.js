var PasswordStore = require('../../models/passwordStore');
var User = require('../../models/user');

var title = 'Login Page';
var viewName = 'login';

var renderPage = function(req, res, errors) {
	delete req.body.user.password;
	var renderObject = req.createFormObject('user');
	res.renderObjectError(viewName, title, renderObject, errors);
};

var renderError = function(req, res, errorMessage) {
	var errors = req.addValidationErrors('user[email]', 
		errorMessage, req.body.user.email);
	console.log(errors);
	renderPage(req, res, errors);
};

exports.view = function(req, res) {
	if(req.session.uid) res.redirect('/');
	res.renderPage(viewName, title);
};

exports.submit = function(req, res, next) {
	var user = req.body.user;
	var email = user.email;
	var password = user.password;
	console.log('authenticating');
	User.authenticate(password, email, function(err, result) {
		if(err) return next(err);
		if(!result) {
			renderError(req, res, 'Invalid email or password');
			return;
		}
		User.findByEmail(user.email, function(err, user) {
			if(err) return next(err);
			if(!user) {
				renderError(req, res, 'User does not exist in our records.');
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
	req.assert('user.email', 'Email is required').notEmpty();
	req.assert('user.password', 'Password is required').notEmpty();

	var errors = req.validationErrors();
	if(errors) {
		renderPage(req, res, errors);
		return;
	}
	next();
};