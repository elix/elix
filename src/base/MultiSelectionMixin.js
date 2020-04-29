import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars
import * as internal from "./internal.js";

/**
 * Adds mutiple-selection semantics to a list-like element.
 *
 * @module MultiSelectionMixin
 * @param {Constructor<ReactiveElement>} Base
 */
export default function MultiSelectionMixin(Base) {
  // The class prototype added by the mixin.
  class MultiSelection extends Base {
    get [internal.defaultState]() {
      return Object.assign(super[internal.defaultState] || {}, {
        selectedIndices: [],
      });
    }

    get selectedIndices() {
      return this[internal.state].selectedIndices;
    }
    set selectedIndices(selectedIndices) {
      this[internal.setState]({ selectedIndices });
    }
  }

  return MultiSelection;
}
