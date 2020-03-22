import * as internal from "./internal.js";
import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars

/**
 * Delegates text selection methods and properties to an inner input-type element
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
    select() {
      this[internal.inputDelegate].select();
    }

    get selectionEnd() {
      return this[internal.inputDelegate].selectionEnd;
    }
    set selectionEnd(selectionEnd) {
      this[internal.inputDelegate].selectionEnd = selectionEnd;
    }

    get selectionStart() {
      return this[internal.inputDelegate].selectionStart;
    }
    set selectionStart(selectionStart) {
      this[internal.inputDelegate].selectionStart = selectionStart;
    }

    setRangeText(...params) {
      this[internal.inputDelegate].setRangeText(...params);
    }

    setSelectionRange(...params) {
      this[internal.inputDelegate].setSelectionRange(...params);
      /** @type {HTMLInputElement} */ const e = document.createElement("input");
      e.select;
    }
  }

  return DelegateInputSelection;
}
