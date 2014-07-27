var User = require('../models/user');

var emailField = 'user.email';
var firstName = 'user.firstName';
var displayName = 'user.displayName';
var lastName = 'user.lastName';
var birthDate = 'user.birthDate';
var contactNumber = 'user.contactNumber';
var password = 'user.password';

var contactNumberPattern = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{2,3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;

var checkName = function(req, field) {
	req.assert(field, 'required').notEmpty();
	req.assert(field, 'at least 2 characters').len(2);
	req.assert(field, 'should be alphanumeric').isAlphanumeric();
};

exports.email = function(req) {
	req.assert(emailField, 'required').notEmpty();
	req.assert(emailField, 'invalid format').isEmail();
};

exports.firstName = function(req) {
	checkName(req, firstName);
};

exports.lastName = function(req) {
	checkName(req, lastName);
};

exports.birthDate = function(req) {
	req.assert(birthDate, 'required').notEmpty();
	req.assert(birthDate, 'should be 9 characters').len(9,9);
	req.assert(birthDate, 'DDMMMYYYY format')
		.matches(/[0-9]{2}[a-z]{3}[0-9]{4}/i);
};

exports.contactNumber = function(req) {
	req.assert(contactNumber, 'required').notEmpty();
	req.assert(contactNumber, 'invalid contact number')
		.matches(contactNumberPattern);
};

exports.password = function(req) {
	req.assert(password, 'required').notEmpty();
	req.assert(password, 'at least 8 characters long').len(8);
};

exports.displayName = function(req) {
	checkName(req, displayName);
};