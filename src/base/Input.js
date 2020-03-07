import * as internal from "./internal.js";
import FormElementMixin from "./FormElementMixin.js";
import html from "../core/html.js";
import WrappedStandardElement from "./WrappedStandardElement.js";

const Base = FormElementMixin(WrappedStandardElement.wrap("input"));

/**
 * Base class for custom input elements
 *
 * `Input` wraps a standard HTML `input` element, allowing for custom styling
 * and behavior while ensuring standard keyboard and focus behavior.
 *
 * @inherits WrappedStandardElement
 * @mixes FormElementMixin
 */
class Input extends Base {
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
    result.content.append(
      html`
        <style>
          [part~="inner"] {
            font: inherit;
            text-align: inherit;
          }
        </style>
      `
    );
    return result;
  }

  // Updating the value can also update the selectionStart and selectionEnd
  // properties, so we have to update our state to match.
  get value() {
    // @ts-ignore
    return super.value;
  }
  set value(value) {
    // @ts-ignore
    super.value = value;
    if (this[internal.shadowRoot]) {
      /** @type {any} */ const inner = this.inner;
      this.setInnerProperty("selectionStart", inner.selectionStart);
      this.setInnerProperty("selectionEnd", inner.selectionEnd);
    }
  }
}

export default Input;
