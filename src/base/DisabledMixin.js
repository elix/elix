import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars
import {
  defaultState,
  raiseChangeEvents,
  rendered,
  setState,
  state,
} from "./internal.js";

/**
 * Tracks the disabled state of a component that can be disabled
 *
 * @module DisabledMixin
 * @param {Constructor<ReactiveElement>} Base
 */
export default function DisabledMixin(Base) {
  // The class prototype added by the mixin.
  class Disabled extends Base {
    // @ts-ignore
    get [defaultState]() {
      return Object.assign(super[defaultState] || {}, {
        disabled: false,
      });
    }

    /**
     * True if the component is disabled, false (the default) if not.
     *
     * The value of this property will be reflected to the `disabled` attribute
     * so that it can be referenced in CSS. Note that this non-native
     * implementation of the `disabled` attribute will *not* trigger the
     * `:disabled` CSS pseudo-class, so your style rules will have to reference
     * the presence or absence of the `disabled` attribute. That is, instead
     * of writing
     *
     *     my-component:disabled { ... }
     *
     * write this instead
     *
     *     my-component[disabled] { ... }
     *
     * Like the native `disabled` attribute, this attribute is boolean. That
     * means that it's *existence* in markup sets the attribute, even if set to
     * an empty string or a string like "false".
     *
     * @type {boolean}
     * @default false
     */
    get disabled() {
      return this[state].disabled;
    }
    // AttributeMarshallingMixin should parse this as a boolean attribute for us.
    set disabled(disabled) {
      this[setState]({ disabled });
    }

    [rendered](/** @type {ChangedFlags} */ changed) {
      if (super[rendered]) {
        super[rendered](changed);
      }

      if (changed.disabled) {
        // Reflect value of disabled property to the corresponding attribute.
        this.toggleAttribute("disabled", this.disabled);

        if (this[raiseChangeEvents]) {
          const oldEvent = new CustomEvent("disabled-changed", {
            bubbles: true,
          });
          this.dispatchEvent(oldEvent);
          /**
           * Raised when the `disabled` property changes.
           *
           * @event disabledchange
           */
          const event = new CustomEvent("disabledchange", {
            bubbles: true,
          });
          this.dispatchEvent(event);
        }
      }
    }
  }

  return Disabled;
}
