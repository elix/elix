const createDefineModules = require('./createDefineModules.js');

createDefineModules()
.catch(err => {
  // We have to deal with top-level exceptions.
  console.error(err);
});
