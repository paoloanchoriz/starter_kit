exports.validationErrorHandler = (function() {

	return function(req, res, next) {
		req.addValidationErrors = function(param, msg, value) {
			var errors = req.validationErrors();
			if(!errors) errors = [];
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

exports.pageRenderer = (function() {
	var getRenderObject = function(title, formObj, msg) {
		var renderObj = { };
		renderObj.title = title;
		if(formObj) renderObj.form = formObj;
		if(msg) renderObj.message = msg;
		return renderObj;
	};

	return function(req, res, next) {
		res.renderPage = function(view, title, formObj, msg) {
			var obj = getRenderObject(title, formObj, msg);
			this.render(view, obj);
		};

		res.renderObjectMessage = function(view, title, formObj, msg) {
			var message = { type : 'info', list : msg };
			this.renderPage(view, title, formObj, message);
		};
		res.renderMessage = function(view, title, msg) {
			this.renderObjectMessage(view, title, undefined, msg);
		};
		res.renderObjectError = function(view, title, formObj, msg) {
			var message = { type : 'error', list : msg };
			this.renderPage(view, title, formObj, message);
		}
		res.renderError = function(view, title, msg) {
			this.renderObjectError(view, title, undefined, msg);
		};
		res.renderObject = function(view, title, formObj) {
			this.renderPage(view, title, formObj);
		};
		req.createFormObject = function(field) {
			var obj = this.body[field];
			var formObj = {};
			for(var fieldName in obj) {
				var key = field + '[' + fieldName + ']';
				formObj[key] = obj[fieldName];
			}
			return formObj;
		};
		next();
	};
}());