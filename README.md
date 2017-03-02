# BackStack

This is an experimental module to inject stacktraces into error objects passed to callbacks.

## Usage

You can use this library to wrap existing callback functions, or just to fill in stack traces.

~~~
const backstack = require('backstack');

// Wrapper usage
AsyncOperation.execute({ data: '1' }, backstack.wrapper(function(err, data) {
	if (err) {
		// err.stack is filled in automatically
	} else {
		// Do stuff with data
	}
}));

// Fill in stack trace manually
AsyncOperation.execute({ data: '1' }, function(err, data) {
	if (err) {
		err = backstack.fillStack(err);

		// err.stack will contain your stacktrace
	} else {
		// Do stuff with data
	}
});
~~~

If `err` is not an object, it will be replaced by an object and the original value of `err` will be stored in `err.msg`.

