const changeCallbacksKey = Symbol('changeCallbacks');
const changeLogKey = Symbol('changeLog');


/**
 * A state object that can reconcile changes from multiple sources.
 */
class State {

  constructor(defaults) {
    this[changeLogKey] = {};
    if (defaults) {
      applyStateChanges(this, defaults);
    }
  }

  get changeLog() {
    return this[changeLogKey];
  }

  clearChangeLog() {
    for (const field in this[changeLogKey]) {
      delete this[changeLogKey][field];
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
    // Also copy over the set of change callbacks.
    const state = Object.assign(new State(), this, {
      [changeCallbacksKey]: this[changeCallbacksKey]
    });
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

   * @param {string[]|string} dependencies - the name(s) of the state fields
   * that should trigger the callback if they are changed
   * @param {function} callback - the function to run when any of the
   * dependencies changes
   */
  onChange(dependencies, callback) {
    if (!this[changeCallbacksKey]) {
      this[changeCallbacksKey] = {};
    }
    const array = dependencies instanceof Array ?
      dependencies :
      [dependencies];
    // Register the callback for each dependent state field.
    array.forEach(dependency => {
      if (!this[changeCallbacksKey][dependency]) {
        this[changeCallbacksKey][dependency] = []
      }
      this[changeCallbacksKey][dependency].push(callback);
    });
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
  for (const key in o) {
    if (o.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
}


function fieldsChanged(state, changes) {
  const changed = {};
  for (const field in changes) {
    const fieldChanged = !equal(changes[field], state[field]);
    if (fieldChanged) {
      changed[field] = true;
    }
  }
  return changed;
}


// Destructively apply the indicated changes to the given state, running
// any registered change handlers.
// Return true if the supplied changes produced actual changes (i.e., didn't
// simply duplicate existing field values).
function applyStateChanges(state, changes) {
  let result = {};

  // Applying the changes may produce a new round of changes, and that round
  // might produce new changes, and so on. Loop until we complete a pass that
  // produces no changes.
  for (
    let changed;
    changed = fieldsChanged(state, changes), !isEmpty(changed);
  ) {

    // Apply the changes to the state.
    Object.assign(state, changes);

    // Remember what actually changed.
    Object.assign(result, changed);

    // Run the change handlers, gathering up the changes those produce.
    changes = {};
    if (state[changeCallbacksKey]) {
      // Get callbacks for fields that changed.
      const callbacks = [];
      for (const field in changed) {
        const callbacksForField = state[changeCallbacksKey][field] || [];
        callbacksForField.forEach(callback => {
          // A single callback may be triggered by multiple fields; only add a
          // callback to the list if it's not already there.
          if (!callbacks.includes(callback)) {
            callbacks.push(callback);
          }
        });
      }
      // Run the callbacks and collect their changes.
      const results = callbacks.map(callback => callback(state, changed));
      // If the change handlers produced changes, we'll run the loop again.
      Object.assign(changes, ...results);
    }
  }

  // Log the changes.
  Object.assign(state[changeLogKey], result);

  return result;
}


export default State;
