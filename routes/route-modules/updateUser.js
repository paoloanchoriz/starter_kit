var User = require('../../models/user');

exports.view = function(req, res) {
	res.render('updateUser', { title: 'Edit User Profile' });
};

var performCallBack = function(req, res, next) {
	return function(err, user) {
		if(err) return next(err);
		req.session.user = user;
		res.redirect('/');
	}
};

exports.updatePassword = function(req, res, next) {
	var newPassword = req.body.user.password;
	var userId = req.session.uid;
	User.updatePassword(newPassword, userId, performCallBack(req, res, next));
};

exports.updateDisplayName = function(req, res, next) {
	var newDisplayName = req.body.user.displayName;
	var userId = req.session.uid;
	User.updateDisplayName(newDisplayName, userId, performCallBack(req, res, next));
};