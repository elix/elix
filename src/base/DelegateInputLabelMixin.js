import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars
import {
  defaultState,
  inputDelegate,
  render,
  setState,
  state,
} from "./internal.js";

/**
 * Delegates its ARIA label property to an inner input-type element
 *
 * This helps ensure that elements built around an inner input element provide a
 * proper accessible label for assistive technologies like screen readers.
 *
 * You can identify which inner input element selection should be delegated to
 * by defining an `internal.inputDelegate` property and returning the desired
 * inner input.
 *
 * @module DelegateInputLabelMixin
 * @param {Constructor<ReactiveElement>} Base
 */
export default function DelegateInputLabelMixin(Base) {
  // The class prototype added by the mixin.
  class DelegateInputLabel extends Base {
    // Forward any ARIA label to the input element.
    get ariaLabel() {
      return this[state].ariaLabel;
    }
    set ariaLabel(ariaLabel) {
      this[setState]({ ariaLabel });
    }

    get [defaultState]() {
      return Object.assign(super[defaultState] || {}, {
        ariaLabel: "",
      });
    }

    [render](changed) {
      super[render](changed);

      if (changed.ariaLabel) {
        const { ariaLabel } = this[state];
        this[inputDelegate].setAttribute("aria-label", ariaLabel);
      }
    }
  }

  return DelegateInputLabel;
}
