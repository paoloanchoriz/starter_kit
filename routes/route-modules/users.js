module.exports = function(req, res) {
	console.log(res.session.user);
	res.send('respond with a resource');
}
