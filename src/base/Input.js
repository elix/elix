import { fragmentFrom } from "../core/htmlLiterals.js";
import DelegateInputLabelMixin from "./DelegateInputLabelMixin.js";
import DelegateIdMixin from './DelegateIdMixin.js';
import FocusVisibleMixin from "./FocusVisibleMixin.js";
import FormElementMixin from "./FormElementMixin.js";
import {
  defaultState,
  firstRender,
  ids,
  inputDelegate,
  raiseChangeEvents,
  render,
  setState,
  template,
} from "./internal.js";
import TrackTextSelectionMixin from "./TrackTextSelectionMixin.js";
import WrappedStandardElement from "./WrappedStandardElement.js";

const Base = DelegateIdMixin(DelegateInputLabelMixin(
  FocusVisibleMixin(
    FormElementMixin(
      TrackTextSelectionMixin(WrappedStandardElement.wrap("input"))
    )
  )
));

/**
 * Base class for custom input elements
 *
 * `Input` wraps a standard HTML `input` element, allowing for custom styling
 * and behavior while ensuring standard keyboard and focus behavior.
 *
 * @inherits WrappedStandardElement
 * @mixes DelegateInputLabelMixin
 * @mixes DelegateIdMixin
 * @mixes FocusVisibleMixin
 * @mixes FormElementMixin
 * @mixes TrackTextSelectionMixin
 */
class Input extends Base {
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      valueCopy: "",
    });
  }

  get [inputDelegate]() {
    return this.inner;
  }

  [render](/** @type {ChangedFlags} */ changed) {
    super[render](changed);
    if (this[firstRender]) {
      // The following jsDoc comment doesn't directly apply to the statement which
      // follows, but is placed there because the comment has to go somewhere to
      // be visible to jsDoc, and the statement is at tangentially related.
      /**
       * Raised when the user changes the element's text content.
       *
       * This is the standard `input` event; the component does not do any work to
       * raise it. It is documented here to let people know it is available to
       * detect when the user edits the content.
       *
       * @event input
       */
      this[ids].inner.addEventListener("input", () => {
        this[raiseChangeEvents] = true;
        // Invoke the value setter to fix up selectionStart/selectionEnd too.
        this.value = /** @type {any} */ (this.inner).value;
        this[raiseChangeEvents] = false;
      });
    }
  }

  get [template]() {
    const result = super[template];
    result.content.append(fragmentFrom.html`
      <style>
        [part~="inner"] {
          font: inherit;
          outline: none;
          text-align: inherit;
        }
      </style>
    `);
    return result;
  }

  get value() {
    return super.value;
  }
  set value(value) {
    super.value = value;
    this[setState]({ valueCopy: value });
  }
}

export default Input;
