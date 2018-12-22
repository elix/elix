const changeHandlersKey = Symbol('changeHandlers');


/**
 * 
 */
export default class State {

  constructor(defaults) {
    if (defaults) {
      this.set(defaults);
    }
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

  /**
   * 
   * @param {object} changes - the changes to apply to the state
   * @returns {boolean} - true if any changes were actually applied
   */
  set(changes) {
    let result = false;

    // Applying the changes may produce a new round of changes, and that round
    // might produce new changes, and so on. Loop until we complete a pass that
    // produces no changes.
    for (
      let changed;
      changed = fieldsChanged(this, changes), !isEmpty(changed);
    ) {
      // We do have some real changes to report.
      result = true;

      // Apply the changes to the state.
      Object.assign(this, changes);

      // Run the change handlers, gathering up the changes those produce.
      const nextChanges = {};
      if (this[changeHandlersKey]) {
        this[changeHandlersKey].forEach(handler => {
          const { dependencies, callback } = handler;
          // Does this handler trigger on any of the changes we have?
          const run = dependencies.some(dependency => changed[dependency]);
          if (run) {
            // Yes, run the change handler and collect its changes.
            const handlerChanges = callback(this, changed);
            Object.assign(nextChanges, handlerChanges);
          }
        });
      }

      // If the change handlers produced changes, we'll run the loop again.
      changes = nextChanges;
    }

    return result;
  }

}


function equal(value1, value2) {
  if (value1 instanceof Date && value2 instanceof Date) {
    return value1.getTime() === value2.getTime();
  }
  return value1 === value2;
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


/**
 * 
 * @param {object} state 
 * @param {object} changes 
 * @returns {object}
 */
function fieldsChanged(state, changes) {
  const changed = {};
  for (const field in changes) {
    const fieldChanged = !equal(changes[field], state[field]);
    if (fieldChanged) {
      changed[field] = true;
    }
  }
  for (const symbol of Object.getOwnPropertySymbols(changes)) {
    const valueChanged = !equal(changes[symbol], state[symbol]);
    if (valueChanged) {
      changed[symbol] = true;
    }
  }
  return changed;
}
