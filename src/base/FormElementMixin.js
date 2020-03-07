import * as internal from "./internal.js";
import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars

/**
 * Allows a component to participate in HTML form submission.
 *
 * The mixin expects the component to define a `value` property.
 *
 * @module FormElementMixin
 * @param {Constructor<ReactiveElement>} Base
 */
export default function FormElementMixin(Base) {
  // The class prototype added by the mixin.
  class FormElement extends Base {
    constructor() {
      super();
      /** @type {any} */ const cast = this;
      if (!this[internal.nativeInternals] && cast.attachInternals) {
        this[internal.nativeInternals] = cast.attachInternals();
      }
    }

    checkValidity() {
      return this[internal.nativeInternals].checkValidity();
    }

    get [internal.defaultState]() {
      return Object.assign(super[internal.defaultState], {
        validationMessage: "",
        valid: true
      });
    }

    // Uncomment for debugging only
    get internals() {
      return this[internal.nativeInternals];
    }

    static get formAssociated() {
      return true;
    }

    /**
     * The ID of the `form` element with which this element is associated,
     * or `null` if the element is not associated with any form. This is provided
     * for consistency with the native HTML
     * [form](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#form)
     * property.
     *
     * @type {string}
     */
    get form() {
      return this[internal.nativeInternals].form;
    }

    /**
     * The name of the form field that will be filled with this element's
     * `value`. This is an analogue of the standard HTML
     * [name](https://developer.mozilla.org/en-US/docs/Web/API/Element/name)
     * property.
     *
     * @type {string}
     */
    get name() {
      return this[internal.state].name;
    }
    set name(name) {
      if ("name" in Base.prototype) {
        super.name = name;
      }
      this[internal.setState]({ name });
    }

    [internal.render](/** @type {ChangedFlags} */ changed) {
      if (super[internal.render]) {
        super[internal.render](changed);
      }

      // Reflect name property to attribute so form will pick it up.
      if (changed.name) {
        this.setAttribute("name", this[internal.state].name);
      }

      if (this[internal.nativeInternals]) {
        // Reflect validity state to internals.
        if (changed.valid || changed.validationMessage) {
          const { valid, validationMessage } = this[internal.state];
          if (valid) {
            this[internal.nativeInternals].setValidity({});
          } else {
            this[internal.nativeInternals].setValidity(
              {
                customError: true
              },
              validationMessage
            );
          }
        }
      }
    }

    [internal.rendered](/** @type {ChangedFlags} */ changed) {
      if (super[internal.rendered]) {
        super[internal.rendered](changed);
      }
      if (changed.value) {
        if (this[internal.nativeInternals]) {
          this[internal.nativeInternals].setFormValue(
            this[internal.state].value,
            this[internal.state]
          );
        }
      }
    }

    reportValidity() {
      return this[internal.nativeInternals].reportValidity();
    }

    /**
     * The "type" of the form field, provided for consistency with the
     * native HTML
     * [type](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#type)
     * property. The value of this property will be the same as the HTML tag
     * name registered for the custom element.
     *
     * @type {string}
     */
    get type() {
      return this.localName;
    }

    get validationMessage() {
      return this[internal.state].validationMessage;
    }

    get validity() {
      return this[internal.nativeInternals].validity;
    }

    get willValidate() {
      return this[internal.nativeInternals].willValidate;
    }
  }

  return FormElement;
}
