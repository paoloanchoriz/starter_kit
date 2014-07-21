// Temporary placeholder for index page
exports.index = function(req, res) {
	console.log(req.session.user);
	res.render('index', {title: 'My New App'});
};
