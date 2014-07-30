var User = require('../models/user');

var emailField = 'user.email';
var firstName = 'user.firstName';
var displayName = 'user.displayName';
var lastName = 'user.lastName';
var birthDate = 'user.birthDate';
var contactNumber = 'user.contactNumber';
var password = 'user.password';

var contactNumberPattern = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{2,3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;
var birthDatePattern = /[0-9]{2}[a-z]{3}[0-9]{4}/i;

var checkName = function(req, field, literalName) {
	req.assert(field, literalName + ' is required').notEmpty();
	req.assert(field, literalName + ' should have at least 2 characters').len(2);
	req.assert(field, literalName + ' should be alphanumeric').isAlphanumeric();
};

exports.email = function(req) {
	req.assert(emailField, 'Email is required').notEmpty();
	req.assert(emailField, 'Invalid email format').isEmail();
};

exports.firstName = function(req) {
	checkName(req, firstName, 'First Name');
};

exports.lastName = function(req) {
	checkName(req, lastName, 'Last Name');
};

exports.birthDate = function(req) {
	req.assert(birthDate, 'BirthDate is required').notEmpty();
	req.assert(birthDate, 'BirthDate should be at least 9 characters').len(9,9);
	req.assert(birthDate, 'BirthDate should be DDMMMYYYY format')
		.matches(birthDatePattern);
};

exports.contactNumber = function(req) {
	req.assert(contactNumber, 'Contact Number is required').notEmpty();
	req.assert(contactNumber, 'Contact Number is invalid contact number')
		.matches(contactNumberPattern);
};

exports.password = function(req) {
	req.assert(password, 'Password is required').notEmpty();
	req.assert(password, 'Password should be at least 8 characters long').len(8);
};

exports.displayName = function(req) {
	checkName(req, displayName, 'Display Name');
};