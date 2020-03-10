import * as internal from "./internal.js";
import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars

/**
 * Tracks the disabled state of a component that can be disabled
 *
 * @module DisabledMixin
 * @param {Constructor<ReactiveElement>} Base
 */
export default function DisabledMixin(Base) {
  // The class prototype added by the mixin.
  class Disabled extends Base {
    get [internal.defaultState]() {
      return Object.assign(super[internal.defaultState], {
        disabled: false
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
      return this[internal.state].disabled;
    }
    // AttributeMarshallingMixin should parse this as a boolean attribute for us.
    set disabled(disabled) {
      this[internal.setState]({ disabled });
    }

    [internal.rendered](/** @type {ChangedFlags} */ changed) {
      if (super[internal.rendered]) {
        super[internal.rendered](changed);
      }
      if (changed.disabled) {
        // Reflect value of disabled property to the corresponding attribute.
        this.toggleAttribute("disabled", this.disabled);
      }
    }
  }

  return Disabled;
}
