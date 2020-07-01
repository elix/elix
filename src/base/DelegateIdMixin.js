import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars
import {
  defaultState,
  inputDelegate,
  render,
  setState,
  state,
} from "./internal.js";

/**
 * Delegates its id to an inner input-type element
 *
 * This helps if a user wants to specify the internal input's id
 *
 * You can identify which inner input element selection should be delegated to
 * by defining an `internal.inputDelegate` property and returning the desired
 * inner input.
 *
 * @module DelegateIdMixin
 * @param {Constructor<ReactiveElement>} Base
 */
export default function DelegateIdMixin(Base) {
  // The class prototype added by the mixin.
  class DelegateId extends Base {
    // Forward any ARIA label to the input element.
    get id() {
      return this[state].id;
    }
    set id(id) {
      this[setState]({ id });
    }

    get [defaultState]() {
      return Object.assign(super[defaultState] || {}, {
        id: "inner",
      });
    }

    [render](changed) {
      super[render](changed);

      if (changed.id) {
        const { id } = this[state];
        this[inputDelegate].setAttribute('global-id', id);
      }
    }
  }

  return DelegateId;
}
