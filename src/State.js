const changeHandlersKey = Symbol('changeHandlers');


/**
 * A state object that can reconcile changes from multiple sources.
 */
class State {

  constructor(defaults) {
    if (defaults) {
      applyStateChanges(this, defaults);
    }
  }

  /**
   * Return a new copy of this state that includes the indicated changes,
   * invoking any registered `onChange` handlers that depend on the changed
   * state members.
   * 
   * There is no need to invoke this method yourself.
   * [ReactiveMixin](ReactiveMixin) will take care of doing that when you invoke
   * [setState](ReactiveMixin#setState).
   * 
   * @param {object} changes - the changes to apply to the state
   * @returns {object} - the new `state`, and a `changed` flag indicating
   * whether there were any substantive changes
   */
  copyWithChanges(changes) {
    // Create a new state object that holds a copy of the old state. If we pass
    // the current state to the State constructor, we'll trigger the application
    // of its change handlers, which will ultimately realize the state is
    // already as refined as possible, and so do work for nothing. So we create
    // a new empty State, merge in the old state, then run the change handlers
    // with the requested changes.
    const state = Object.assign(new State(), this);
    const changed = applyStateChanges(state, changes);
    return { state, changed };
  }
  
  /**
   * Ask the `State` object to invoke the specified `callback` when any of the
   * state members listed in the `dependencies` array change.
   * 
   * The `callback` should be a function that accepts:
   * 
   * * A `state` parameter indicating the current state.
   * * A `changed` parameter. This will be a set of flags that indicate which
   *   specified state members have changed since the last time the callback was
   *   run. If the handler doesn't care about which specific members have
   *   changed, this parameter can be omitted.
   * 
   * The callback should return `null` if it finds the current state acceptable.
   * If the callback wants to make changes to the state, it returns an object
   * representing the changes that should be applied to the state. The callback
   * does *not* need to check to see whether the changes actually need to be
   * applied to the state; the `State` object itself will avoid applying
   * unnecessary changes.
   * 
   * The common place to invoke `onChange` is when an element's `defaultState`
   * is being constructed.

   * @param {string[]|string} dependencies - the name(s) of the state members
   * that should trigger the callback if they are changed
   * @param {function} callback - the function to run when any of the
   * dependencies changes
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


// Destructively apply the indicated changes to the given state, running
// any registered change handlers.
// Return true if the supplied changes produced actual changes (i.e., didn't
// simply duplicate existing field values).
function applyStateChanges(state, changes) {
  let result = false;

  // Applying the changes may produce a new round of changes, and that round
  // might produce new changes, and so on. Loop until we complete a pass that
  // produces no changes.
  for (
    let changed;
    changed = fieldsChanged(state, changes), !isEmpty(changed);
  ) {
    // We do have some real changes to report.
    result = true;

    // Apply the changes to the state.
    Object.assign(state, changes);

    // Run the change handlers, gathering up the changes those produce.
    const nextChanges = {};
    if (state[changeHandlersKey]) {
      state[changeHandlersKey].forEach(handler => {
        const { dependencies, callback } = handler;
        // Does this handler trigger on any of the changes we have?
        const run = dependencies.some(dependency => changed[dependency]);
        if (run) {
          // Yes, run the change handler and collect its changes.
          const handlerChanges = callback(state, changed);
          Object.assign(nextChanges, handlerChanges);
        }
      });
    }

    // If the change handlers produced changes, we'll run the loop again.
    changes = nextChanges;
  }

  return result;
}


export default State;
