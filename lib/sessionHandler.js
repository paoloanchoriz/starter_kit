/**
	Functions that will be used to handle session and stuff.
*/
var User = require('../models/authentication/user');
var MongoUser = require('../models/user');
var express = require('express');

var res = express.response;

// Attaches user object to session. This will mean that the
// user is logged in.
exports.userHandler = function(req, res, next) {
	var id = req.session.uid;
	if(!id) return next();

	MongoUser.findOne({ _id : id }, function(err, mongoUser) {
		if(err) return next(err);
		req.session.uid = mongoUser._id;
		req.session.user = res.locals.user = mongoUser;
		next();
	});
	User.get(id, function(err, user) {
		if(err) return next(err);
		req.user = res.locals.user = user;
		next();
	});
};

// Later than sooner, I will need to find a way to easily 
// handle messages without adding functions to response object.
exports.messageHandler = (function() {
	res.message = function(msg, type) {
		type = type || 'info';
		var sess = this.req.session;
		sess.messages = sess.messages || [];
		sess.messages.push({ type: type, string: msg });
	};

	res.error = function(msg) {
		return this.message(msg, 'error');
	};

	return function(req, res, next) {
		res.locals.messages = req.session.messages || [];
		res.locals.removeMessages = function() {
			req.session.messages = [];
		};
		next();
	};
}());

// Checks if there is a session and there is a uid else redirect
// to login page
exports.authenticationHandler = function(req, res, next) {
	if(!req.session || !req.session.uid) {
		res.redirect('/login');
	} else {
		next();
	}
}

