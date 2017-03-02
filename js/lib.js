// BackStack - a module to wrap callbacks in code that fills in a stack
//             trace automatically. Can be used at multiple stages of a
//             callback chain as it retains the first stacktrace.

function fillStack(err) {
  var origErr = err;
  try {
    // If no err given, create a new object
    if (err === null || err === undefined) {
      err = {};
    }

    if (typeof err !== 'object') {
      err = { msg: err };
    }

    // Do not overwrite if stack is already filled in
    if (err.stack) return err;

    var tmp = {};
    Error.captureStackTrace(tmp);

    // Paranoia
    if (!tmp.stack || !tmp.stack.split) return err;

    // Remove fillStack() from the stack
    tmp = tmp.stack.split('\n');
    tmp.splice(1,1);

    // 'err' is modified only at the very end
    err.stack = tmp.join('\n');
    return err;

  } catch(e) {
    // Something totally unexpected happened
    console.error('fillStack threw an exception. This should never happen. The exception is:', e);
    return origErr;
  }
}

// Wraps 'callback' as a function that uses fillStack if called with an err
// Use like so:
//   FooModel.find({blah:true}, backstack.wrapper(callback));
//    ..or 
//   FooModel.find({blah:true}, backstack.wrapper(function(err, data) {
//     if (err) return callback(err);
//     // do stuff with data
//     callback(null);
//   }));
function stackback(callback) {
  return function() {
    // err is the first parameter, modify it if it exists, otherwise just call the callback with the exact same parameters as this was called

    if (arguments[0]) {
      arguments[0] = fillStack(arguments[0]);
    }

    callback.apply(this, arguments);
  }
}

exports.wrapper = stackback;
exports.fillStack = fillStack;
