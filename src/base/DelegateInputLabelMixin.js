import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars
import {
  defaultState,
  firstRender,
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

    // Forward ARIA labelledby to the input element.
    get ariaLabelledBy() {
      return this[state].ariaLabelledBy;
    }
    set ariaLabelledBy(ariaLabelledBy) {
      if (this.getRootNode() !== null) {
        const ariaLabel = this.getRootNode().querySelector(
          `#${ariaLabelledBy}`
        ).innerText;
        this[setState]({ ariaLabel });
      }
      this[setState]({ ariaLabelledBy });
    }

    get [defaultState]() {
      return Object.assign(super[defaultState] || {}, {
        ariaLabel: "",
        ariaLabelledBy: "",
      });
    }

    [render](changed) {
      super[render](changed);
      if (changed.ariaLabel) {
        const { ariaLabel } = this[state];

        this[inputDelegate].setAttribute("aria-label", ariaLabel);
        this.removeAttribute('aria-label');
      }

      if (changed.ariaLabelledBy) {
        console.log(this[state])
        const { ariaLabelledBy } = this[state];

        this[inputDelegate].setAttribute('aria-labelledby', ariaLabelledBy);
        this.removeAttribute('aria-labelledby');
      }
    }
  }

  return DelegateInputLabel;
}
