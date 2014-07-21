var User = require('../../models/authentication/user');
var MongoUser = require('../../models/user');

var saveMongoUser = function(formUser, req, res, next) {
	console.log(formUser);
	var mongoDetails = {
		_id : formUser.id,
		userName : formUser.name,
		firstName : formUser.firstName,
		lastName : formUser.lastName,
		birthDate : new Date(formUser.birthDate),
		createDate : new Date(),
		email : formUser.email,
		contactNumber : formUser.contactNumber
	};

	new MongoUser(mongoDetails).save(function(err) {
		if(err) return next(err);

		// Successfully saved so details is copied to session
		req.session.uid = mongoDetails._id;
		req.session.user = mongoDetails;
		res.redirect('/');
	});
};

var saveUser = function(req, res, next, formUser) {
	return function(err) {
		if(err) return next(err);

		if(formUser.id) {
			res.error('Username already taken!');
			return;
		}

		var authUser = new User({
			name : formUser.name,
			pass : formUser.pass
		});

		// TODO: Need to pass id that is saved?
		authUser.save(function(err, id) {
			if(err) return next(err);
			formUser.id = id;
			saveMongoUser(formUser, req, res, next);
		});
	};
};

exports.view = function(req, res) {
	if(req.session.uid) res.redirect('/');
	res.render('register', { title: 'Register' });
};

exports.submit = function(req, res, next) {
	var formUser = req.body.user;
	// TODO: validation goes here
	User.getByName(formUser.name, saveUser(req, res, next, formUser));
};
