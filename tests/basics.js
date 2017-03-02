var sandbox = require('nodeunit').utils.sandbox;

var backstack = require('../js/lib.js');

module.exports = {
	testStackIsFilled: function (test) {
		function asyncMethod(callback) {
			setTimeout(function() {
				callback({ foo: 'error' });
			},50);
		}

		asyncMethod(backstack.wrapper(function(err) {
			test.equals(err.stack !== undefined, true);
			test.equals(err.foo, 'error');
			test.done();
		}));
	},
	testStackIsFilledStringError: function (test) {

		function asyncMethod(callback) {
			setTimeout(function() {
				callback('error');
			},50);
		}

		asyncMethod(backstack.wrapper(function(err) {
			test.equals(err.stack !== undefined, true);
			test.equals(err.msg, 'error');
			test.done();
		}));
	},
	testStackIsFilledOnlyOnce: function (test) {
		function getDataFromDatabase(callback) {
			callback({ foo: 'error', stack: 'previous-stack' });
		}


		getDataFromDatabase(backstack.wrapper(function(err) {
			test.equals(err.stack !== undefined, true);
			test.equals(err.foo, 'error');
			// If this code wrapping the callback would overwrite the stacktrace, the stacktrace would not contain getDataFromDatabase
			test.equals(err.stack, 'previous-stack');
			test.done();
		}));
	},


}
