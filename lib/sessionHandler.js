/**
	Functions that will be used to handle session and stuff.
*/
var User = require('../models/user');
var express = require('express');

var res = express.response;

exports.userHandler = function(req, res, next) {
	var id = req.session.uid;
	if(id) res.locals.user = req.session.user;
	return next();
};

// TODO[PAO]: update messageHandler, let routers handle each messages?
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

// TODO[PAO]: update authenticationHandler to check roles and routes
// Checks if there is a session and there is a uid else redirect
// to login page
exports.authenticationHandler = function(req, res, next) {
	if(!req.session.uid) {
		res.redirect('/login');
	} else {
		next();
	}
}

