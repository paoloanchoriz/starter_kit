// var User = require('../../models/authentication/user');
var User = require('../../models/user');
var PasswordStore = require('../../models/passwordStore');

// TODO: Update router to use Mongo User as base schema
// and use PasswordStore to store users pass, id and email
// key value will be user:email { pass, id }
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
			contactNumber : formUser.contactNumber
		}).save(function(err, user) {
			if(err) return next(err);
			

			var passwordStore = new PasswordStore({
				id : user._id,
				pass : formUser.pass,
				email : user.email
			});
			passwordStore.save(function(err) {
				req.session.uid = user._id;
				req.session.user = user;
				res.redirect('/users');
			});
		});
	};
};

exports.view = function(req, res) {
	//if(req.session.uid) res.redirect('/');
	res.render('register', { title: 'Register' });
};

exports.submit = function(req, res, next) {
	// TODO[PAO]: validation goes here
	// TODO[PAO]: move findByEmail to validation part
	User.findByEmail(req.body.user.email, saveUser(req, res, next));
};
