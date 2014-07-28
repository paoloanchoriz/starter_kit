module.exports = (function() {

	return function(req, res, next) {
		req.addValidationErrors = function(param, msg, value) {
			var errors = req.validationErrors();
			errors.push({
				para : param,
				msg : msg,
				value : value
			});

			return errors;
		}
		next();
	};
}());