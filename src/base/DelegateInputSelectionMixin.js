import * as internal from "./internal.js";
import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars

/**
 * Delegates text selection methods and properties to an inner input-type element
 *
 * This mixin makes it easy for you to support the complete set standard DOM
 * APIs for selecting text by delegating those methods to an inner input-type
 * element.
 *
 * You can identify which inner input element selection should be delegated to
 * by defining an `internal.inputDelegate` property and returning the desired
 * inner input.
 *
 * @module DelegateInputSelectionMixin
 * @param {Constructor<ReactiveElement>} Base
 */
export default function DelegateInputSelectionMixin(Base) {
  // The class prototype added by the mixin.
  class DelegateInputSelection extends Base {
    /**
     * Selects all the text.
     *
     * See the standard [select](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/select)
     * documentation for details.
     */
    select() {
      this[internal.inputDelegate].select();
    }

    /**
     * The end index of the selected text.
     *
     * See the standard [input](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement)
     * element documentation for details.
     */
    get selectionEnd() {
      return this[internal.inputDelegate].selectionEnd;
    }
    set selectionEnd(selectionEnd) {
      this[internal.inputDelegate].selectionEnd = selectionEnd;
    }

    /**
     * The beginning index of the selected text.
     *
     * See the standard [input](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement)
     * element documentation for details.
     */
    get selectionStart() {
      return this[internal.inputDelegate].selectionStart;
    }
    set selectionStart(selectionStart) {
      this[internal.inputDelegate].selectionStart = selectionStart;
    }

    /**
     * Replaces a range of text.
     *
     * See the standard [setRangeText](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/setRangeText)
     * documentation for details.
     */
    setRangeText(...params) {
      this[internal.inputDelegate].setRangeText(...params);
    }

    /**
     * Sets the start and end positions of the current text selection.
     *
     * See the standard [setSelectionRange](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/setSelectionRange)
     * documentation for details.
     */
    setSelectionRange(...params) {
      this[internal.inputDelegate].setSelectionRange(...params);
      /** @type {HTMLInputElement} */ const e = document.createElement("input");
      e.select;
    }
  }

  return DelegateInputSelection;
}
