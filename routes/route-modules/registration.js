var User = require('../../models/user');
var userValidator = require('../../validators/userValidator');

var getRenderObject = function(err, user) {
	return {
		view : 'register',
		content: {
			user : user,
			errors : err,
			title : 'Register'
		}
	};
};

exports.view = function(req, res) {
	if(req.session.uid) res.redirect('/');
	res.render('register', { title : 'Register' });
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

var renderPage = function(res, user, err) {
	var renderObject = getRenderObject(err, user);
	res.render(renderObject.view, renderObject.content);
};

// TODO: redirect validations to proper pages with error messages and model
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
		renderPage(res, user, errors);
		return;
	}
	
	var email = req.body.user.email;
	User.findByEmail(email, function(err, user) {
		if(err) return next(err);

		if(user) {
			renderPage(res, user, 
					req.addValidationErrors('user[email]', 
						'Email is already in use.', email)
				);
			return;
		}
		next();
	});
};
