// declare all dependencies here
var index = require('./route-modules/index');
var authentication = require('./route-modules/authentication');
var registration = require('./route-modules/registration');
var sessionHandler = require('../lib/sessionHandler');
var users = require('./route-modules/users');
var updateUser = require('./route-modules/updateUser');

// declare all routers and middlewares here
module.exports.initRouters = function(app) {
	// Attach user to session if uid exists
	
	// Add message utilities to response object
	app.use(sessionHandler.messageHandler);

	app.get('/logout', authentication.logout);

	app.route('/login')
		.get(authentication.view)
		.post(authentication.submit);

	app.route('/register')
		.get(registration.view)
		.post(registration.validate, registration.submit);

	// middle ware to authenticate user
	// above are not restricted pages
	app.use(sessionHandler.authenticationHandler);
	// below are restricted pages
	app.get('/updateUser', updateUser.view)

	app.post('/password', updateUser.updatePassword);
	app.post('/displayName', updateUser.updateDisplayName);

	app.use(sessionHandler.userHandler);
	app.get('/:index(index)?', index.index);

	app.get('/users', users);
};
