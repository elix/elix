import { stateChanged } from './utilities.js';
import * as symbols from './symbols.js';


const previousStateKey = Symbol('previousSelection');


export default function FilterItemsMixin(Base) {
  
  return class FilterItems extends Base {

    get defaultState() {
      return Object.assign({}, super.defaultState, {
        filter: null
      });
    }

    get filter() {
      return this.state.filter;
    }
    set filter(filter) {
      // If external code sets the filter, it's impossible for that code to
      // predict the effects on the items and selection, so we'll need to raise
      // change events.
      const saveRaiseChangesEvents = this[symbols.raiseChangeEvents];
      this[symbols.raiseChangeEvents] = true;
      this.setState({ filter });
      this[symbols.raiseChangeEvents] = saveRaiseChangesEvents;
    }

    [symbols.itemMatchesState](item, state) {
      const base = super[symbols.itemMatchesState] ?
        super[symbols.itemMatchesState](item, state) :
        true;
      if (!base) {
        return false;
      }
      const text = item.textContent && item.textContent.toLowerCase();
      const filter = state.filter && state.filter.toLowerCase();
      return !filter ?
        true :
        !text ?
          false :
          text.includes(filter);
    }

    refineState(state) {
      let result = super.refineState ? super.refineState(state) : true;
      state[previousStateKey] = state[previousStateKey] || {
        filter: null,
      };
      const changed = stateChanged(state, state[previousStateKey]);
      if (changed.filter) {
        // Indicate that items need to be recalculated.
        state.items = null;
        result = false;
      }
      return result;
    }

  }
}
