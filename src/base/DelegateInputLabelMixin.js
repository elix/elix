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

    // Forward ARIA labelledby as an aria-label to the input element.
    get ariaLabelledby() {
      return this[state].ariaLabelledby;
    }
    set ariaLabelledby(ariaLabelledby) {
      if (this.getRootNode() !== null) {
        // @ts-ignore
        let labelNode = this.getRootNode().querySelector(
          `#${ariaLabelledby}`
        );

        labelNode.setAttribute('aria-hidden', true);
        const ariaLabel = labelNode.innerText;
        this[setState]({ ariaLabel, ariaLabelledby });
      }
    }

    get [defaultState]() {
      return Object.assign(super[defaultState] || {}, {
        ariaLabel: "",
        ariaLabelledby: "",
      });
    }

    [render](changed) {
      super[render](changed);
      if (this[firstRender]) {
        if (this.getRootNode() !== null) {
          // @ts-ignore
          const labelNode = this.getRootNode().querySelector(
            `[for="${this.id}"]`
          )
          if (labelNode !== null) {
            const ariaLabel = labelNode.innerText;
            labelNode.setAttribute('aria-hidden', true);
            this[setState]({ ariaLabel });
          } else {
            const labelNode = this.closest('label');
            if (labelNode !== null) {
              const ariaLabel = labelNode.innerText;
              this[setState]({ ariaLabel });
            }
          }
        }
      }

      if (changed.ariaLabel) {
        const { ariaLabel } = this[state];
        this[inputDelegate].setAttribute("aria-label", ariaLabel);
        this.removeAttribute('aria-label');
      }

      if (changed.ariaLabelledby) {
        this.removeAttribute('aria-labelledby');
      }
    }
  }

  return DelegateInputLabel;
}
