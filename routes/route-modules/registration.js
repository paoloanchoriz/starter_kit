var User = require('../../models/user');
var userValidator = require('../../validators/userValidator');

var handleErrors = function(res, errList) {
	var errLength = errList.length;
	for(var i = 0; i < errLength; i++) {
		var error = errList[i];
		res.error(error.msg);
	}
};

var saveUser = function(req, res, next) {
	return function(formUser, err) {
		if(err) return next(err);

		if(formUser) {
			res.error('Email already in use.');
			res.redirect('back');
			return;
		}

		formUser = req.body.user;

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
};

exports.view = function(req, res) {
	if(req.session.uid) res.redirect('/');
	res.render('register', { title: 'Register' });
};

exports.submit = function(req, res, next) {
	// TODO[PAO]: validation goes here
	// TODO[PAO]: move findByEmail to validation part
	User.findByEmail(req.body.user.email, saveUser(req, res, next));
};

exports.validate = function(req, res, next) {
	userValidator.firstName(req);
	userValidator.lastName(req);
	userValidator.birthDate(req);
	userValidator.contactNumber(req);
	userValidator.password(req);
	userValidator.email(req);

	var errors = req.validationErrors();
	if(errors) {
		handleErrors(res, errors);
		res.redirect('back');
		return;
	}
	
	User.findByEmail(req.body.user.email, function(err, user) {
		if(err) return next(err);

		if(user) {
			req.validationErrors.push({
				param : 'user.email',
				msg : 'already in use',
				value : user.email
			});
			handleErrors(res, errors);
			res.redirect('back');
			return;
		}
		next();
	});
};
