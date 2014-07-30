var User = require('../../models/user');
var userValidator = require('../../validators/userValidator');

var title = 'Register';
var viewName = 'register';

var renderPage = function(req, res, errors) {
	delete req.body.user.password;
	res.renderObjectError(viewName, title, req.createFormObject('user'), errors);
};

exports.view = function(req, res) {
	if(req.session.uid) res.redirect('/');
	res.renderPage(viewName, title);
};

exports.submit = function(req, res, next) {
	var formUser = req.body.user;

	if(!formUser.displayName) {
		formUser.displayName = formUser.firstName + 
			' ' + formUser.lastName;
	}

	new User({
		displayName : formUser.displayName,
		firstName : formUser.firstName,
		lastName : formUser.lastName,
		birthDate : new Date(formUser.birthDate),
		email : formUser.email,
		contactNumber : formUser.contactNumber,
		password : formUser.password
	}).saveCredentials(function(err, user) {
		if(err) return next(err);
			
		req.session.uid = user._id;
		req.session.user = user;
		res.redirect('/');
	});
};

exports.validate = function(req, res, next) {
	var user = req.body.user.email;

	userValidator.firstName(req);
	userValidator.lastName(req);
	userValidator.birthDate(req);
	userValidator.contactNumber(req);
	userValidator.password(req);
	userValidator.email(req);

	var errors = req.validationErrors();
	if(errors) {
		renderPage(req, res, errors);
		return;
	}
	
	var email = req.body.user.email;
	User.findByEmail(email, function(err, user) {
		if(err) return next(err);

		if(user) {
			errors = req.addValidationErrors('user[email]', 
						'Email is already in use.', email);
			renderPage(req, res, errors);
			return;
		}
		next();
	});
};
