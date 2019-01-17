const changeHandlersKey = Symbol('changeHandlers');


/**
 * A state object that can reconcile changes from multiple sources.
 */
class State {

  constructor(defaults) {
    if (defaults) {
      this.set(defaults);
    }
  }
  
  /**
   * Ask the `State` object to invoke the specified `callback` when any of the
   * state members listed in the `dependencies` array change.
   * 
   * The `callback` should be a function that accepts:
   * 
   * * A `state` parameter indicating the current state.
   * * A `changed` parameter. This will be a set of flags that indicate which
   * state members have changed since the last time the callback was run.
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
   * 
   * Example: a mixin like [SingleSelectionMixin](SingleSelectionMixin)
   * wants to track a `selectedIndex` state member that always points to
   * a valid member of an array tracked by a state member called `items`.
   * The mixin wants to ensure that, if the `items` array changes,
   * the `selectedIndex` will still fall within the bounds of the array.
   * This can be accomplished like this:
   * 
   * ```js
   * const SampleMixin = Base => class Sample extends Base {
   *   get defaultState() {
   *     const state = super.defaultState;
   *     // Ask to be notified when `items` changes.
   *     state.onChange('items', (state, changed) => {
   *       const { items, selectedIndex } = state;
   *       const length = items.length;
   *       // Force index within bounds of -1 (no selection)
   *       // to array length - 1.
   *       const index = Math.max(Math.min(selectedIndex, length-1), -1);
   *       return {
   *         selectedIndex: index
   *       };
   *     });
   *     return state;
   *   }
   * }
   * ```
   * 
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

  /**
   * Apply the desired changes to the state, invoking any registered
   * `onChange` handlers that depend on the changed state members.
   * 
   * This is a destructive operation. You should not need to invoke
   * this method yourself for a component's `state` object. Instead,
   * [ReactiveMixin](ReactiveMixin) will take care of doing that
   * when you invoke [setState](ReactiveMixin#setState).
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


export default State;
