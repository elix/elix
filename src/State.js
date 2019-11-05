const changeCallbacksKey = Symbol('changeCallbacks');

/**
 * A state object that can reconcile changes from multiple sources.
 */
class State {
  constructor(/** @type {PlainObject} */ defaults) {
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
   * [internal.setState]](ReactiveMixin[internal.setState]).
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

    // If the changes include new change callbacks, apply those too.
    if (changes[changeCallbacksKey]) {
      // Also copy over the set of change callbacks.
      state[changeCallbacksKey] = changes[changeCallbacksKey];
    }

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
    const array = dependencies instanceof Array ? dependencies : [dependencies];
    // Register the callback for each dependent state field.
    array.forEach(dependency => {
      /** @type {any} */
      const changeCallbacks = this[changeCallbacksKey];
      if (!changeCallbacks[dependency]) {
        changeCallbacks[dependency] = [];
      }
      changeCallbacks[dependency].push(callback);
    });
  }
}

/**
 * Return true if the two values are equal.
 *
 * @private
 * @param {any} value1
 * @param {any} value2
 * @returns {boolean}
 */
function equal(value1, value2) {
  if (value1 instanceof Date && value2 instanceof Date) {
    return value1.getTime() === value2.getTime();
  }
  return value1 === value2;
}

/**
 * Return a dictionary of flags indicating which of the indicated changes to the
 * state are actually changes. Return null if there were no changes.
 *
 * @private
 * @param {PlainObject} state
 * @param {PlainObject} changes
 */
function fieldsChanged(state, changes) {
  let changed = null;
  for (const field in changes) {
    if (!equal(changes[field], state[field])) {
      if (!changed) {
        changed = {};
      }
      changed[field] = true;
    }
  }
  return changed;
}

/**
 * Destructively apply the indicated changes to the given state, running
 * any registered change handlers.
 * Return a dictionary of flags indicating which fields actually changed,
 * or null if there were no changes.
 *
 * @private
 * @param {PlainObject} state
 * @param {PlainObject} changes
 */
function applyStateChanges(state, changes) {
  let result = null;

  // Applying the changes may produce a new round of changes, and that round
  // might produce new changes, and so on. Loop until we complete a pass that
  // produces no changes.
  /** @type {PlainObject|null} */ let changed;
  /* eslint-disable no-cond-assign */
  for (; (changed = fieldsChanged(state, changes)); ) {
    // Apply the changes to the state.
    Object.assign(state, changes);

    // Remember what actually changed.
    if (!result) {
      result = {};
    }
    Object.assign(result, changed);

    // Run the change handlers, gathering up the changes those produce.
    /** @type {IndexedObject<ChangeHandler[]>} */
    const changeCallbacks = /** @type {any} */ (state)[changeCallbacksKey];
    if (changeCallbacks) {
      // Get callbacks for fields that changed.
      /** @type {ChangeHandler[]} */
      const callbacksToRun = [];
      for (const field in changed) {
        const callbacksForField = changeCallbacks[field] || [];
        callbacksForField.forEach(callback => {
          // A single callback may be triggered by multiple fields; only add a
          // callback to the list if it's not already there.
          // @ts-ignore
          if (!callbacksToRun.includes(callback)) {
            callbacksToRun.push(callback);
          }
        });
      }
      // Run the callbacks and collect their changes.
      const results = callbacksToRun.map(callback => callback(state, changed));
      // If the change handlers produced changes, we'll run the loop again.
      changes = Object.assign({}, ...results);
    }
  }

  return result;
}

export default State;
