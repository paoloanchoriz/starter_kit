module.exports = function(req, res) {
	console.log(req.session.user);
	res.send('respond with a resource');
}
