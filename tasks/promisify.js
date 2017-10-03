'use strict';

// Given a function that takes a Node-style callback, return a function that
// returns a promise for that function's result.
module.exports = fn => function() {
  let args = [...arguments];
  return new Promise(function(resolve, reject) {
    fn(...args, function(error, result) {
      if (error) {
        return reject(error);
      } else {
        return resolve(result);
      }
    });
  });
};
