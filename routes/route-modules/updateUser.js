var User = require('../../models/user');
var userValidator = require('../../validators/userValidator');

var viewName = 'updateUser';
var title = 'Edit User Profile';

exports.view = function(req, res) {
	res.renderPage(viewName, title);
};

var performCallBack = function(req, res, next) {
	return function(err, user) {
		if(err) return next(err);
		req.session.user = user;
		res.redirect('/');
	}
};

exports.validatePassword = function(req, res, next) {
	var id = req.session.uid;
	var password = req.body.user.password;
	var oldPassword = req.body.user.oldPassword;
	User.matchPassword(id, oldPassword, function(err, result) {
		if(err) next(err);
		if(!result) {
			errors = req.addValidationErrors('user[oldPassword]',
				'Please confirm old password', oldPassword);
			res.renderError(viewName, title, errors);
			return;
		}

		userValidator.password(req);

		var errors = req.validationErrors();
		if(errors) {
			res.renderError(viewName, title, errors);
			return;
		}
		next();
	});

};

exports.updatePassword = function(req, res, next) {
	var newPassword = req.body.user.password;
	var userId = req.session.uid;
	User.updatePassword(newPassword, userId, performCallBack(req, res, next));
};

exports.validateDisplayName = function(req, res, next) {
	userValidator.displayName(req);
	var errors = req.validationErrors();
	if(errors) {
		res.renderObjectError(viewName, title,
			req.createFormObject('user'), errors);
		return;
	}
	next();
};

exports.updateDisplayName = function(req, res, next) {
	var newDisplayName = req.body.user.displayName;
	var userId = req.session.uid;
	User.updateDisplayName(newDisplayName, userId, performCallBack(req, res, next));
};