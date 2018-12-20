const changeHandlersKey = Symbol('changeHandlers');


export default class State {

  constructor(defaults) {
    if (defaults) {
      this.apply(defaults);
    }
  }

  apply(changes) {
    let result = false;
    for (
      let changed;
      changed = fieldsChanged(this, changes), !isEmpty(changed);
    ) {
      result = true; // There were real changes.
      Object.assign(this, changes);
      const nextChanges = {};
      if (this[changeHandlersKey]) {
        this[changeHandlersKey].forEach(handler => {
          const { dependencies, callback } = handler;
          const run = dependencies.some(dependency => changed[dependency]);
          if (run) {
            const updates = callback(this, changed);
            Object.assign(nextChanges, updates);
          }
        });
      }
      changes = nextChanges;
    }
    return result;
  }
  
  /**
   * 
   * @param {string[]|string} dependencies 
   * @param {function} callback
   */
  onChange(dependencies, callback) {
    const array = dependencies instanceof Array ?
      dependencies :
      [dependencies];
    const changeHandler = {
      dependencies: array,
      callback
    };
    if (!this[changeHandlersKey]) {
      this[changeHandlersKey] = [];
    }
    this[changeHandlersKey].push(changeHandler);
  }

}


// Return true if o is an empty object.
function isEmpty(o) {
  for (var key in o) {
    if (o.hasOwnProperty(key)) {
      return false;
    }
  }
  return Object.getOwnPropertySymbols(o).length === 0;
}


function fieldsChanged(state, changes) {
  const changed = {};
  for (const field in changes) {
    const fieldChanged = changes[field] !== state[field];
    if (fieldChanged) {
      changed[field] = true;
    }
  }
  for (const symbol of Object.getOwnPropertySymbols(changes)) {
    const valueChanged = changes[symbol] !== state[symbol];
    if (valueChanged) {
      changed[symbol] = true;
    }
  }
  return changed;
}
