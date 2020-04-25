import html from "../core/html.js";
import DelegateInputLabelMixin from "./DelegateInputLabelMixin.js";
import FocusVisibleMixin from "./FocusVisibleMixin.js";
import FormElementMixin from "./FormElementMixin.js";
import * as internal from "./internal.js";
import TrackTextSelectionMixin from "./TrackTextSelectionMixin.js";
import WrappedStandardElement from "./WrappedStandardElement.js";

const Base = DelegateInputLabelMixin(
  FocusVisibleMixin(
    FormElementMixin(
      TrackTextSelectionMixin(WrappedStandardElement.wrap("input"))
    )
  )
);

/**
 * Base class for custom input elements
 *
 * `Input` wraps a standard HTML `input` element, allowing for custom styling
 * and behavior while ensuring standard keyboard and focus behavior.
 *
 * @inherits WrappedStandardElement
 * @mixes FormElementMixin
 * @mixes TrackTextSelectionMixin
 */
class Input extends Base {
  get [internal.inputDelegate]() {
    return this.inner;
  }

  [internal.render](/** @type {ChangedFlags} */ changed) {
    super[internal.render](changed);
    if (this[internal.firstRender]) {
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
      this[internal.ids].inner.addEventListener("input", () => {
        this[internal.raiseChangeEvents] = true;
        // Invoke the value setter to fix up selectionStart/selectionEnd too.
        this.value = /** @type {any} */ (this.inner).value;
        this[internal.raiseChangeEvents] = false;
      });

      this.setAttribute("role", "none");
    }
  }

  get [internal.template]() {
    const result = super[internal.template];
    result.content.append(html`
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
}

export default Input;
