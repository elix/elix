import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars
import {
  defaultState,
  nativeInternals,
  render,
  rendered,
  setState,
  state,
} from "./internal.js";

/**
 * Allows a component to participate in HTML form submission.
 *
 * The mixin expects the component to define a `value` property of type
 * `string`.
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
      if (!this[nativeInternals] && cast.attachInternals) {
        this[nativeInternals] = cast.attachInternals();
      }
    }

    checkValidity() {
      return this[nativeInternals].checkValidity();
    }

    // @ts-ignore
    get [defaultState]() {
      return Object.assign(super[defaultState] || {}, {
        name: "",
        validationMessage: "",
        valid: true,
      });
    }

    // Uncomment for debugging only
    get internals() {
      return this[nativeInternals];
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
      return this[nativeInternals].form;
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
      return this[state] ? this[state].name : "";
    }
    set name(name) {
      const s = String(name);
      if ("name" in Base.prototype) {
        super.name = s;
      }
      this[setState]({
        name: s,
      });
    }

    [render](/** @type {ChangedFlags} */ changed) {
      if (super[render]) {
        super[render](changed);
      }

      // Reflect name property to attribute so form will pick it up.
      if (changed.name) {
        const { name } = this[state];
        if (name) {
          this.setAttribute("name", name);
        } else {
          this.removeAttribute("name");
        }
      }

      if (this[nativeInternals] && this[nativeInternals].setValidity) {
        // Reflect validity state to internals.
        if (changed.valid || changed.validationMessage) {
          const { valid, validationMessage } = this[state];
          if (valid) {
            this[nativeInternals].setValidity({});
          } else {
            this[nativeInternals].setValidity(
              {
                customError: true,
              },
              validationMessage
            );
          }
        }
      }
    }

    [rendered](/** @type {ChangedFlags} */ changed) {
      if (super[rendered]) {
        super[rendered](changed);
      }
      if (changed.value) {
        if (this[nativeInternals]) {
          this[nativeInternals].setFormValue(this[state].value, this[state]);
        }
      }
    }

    reportValidity() {
      return this[nativeInternals].reportValidity();
    }

    /**
     * The "type" of the form field, provided for consistency with the
     * native HTML
     * [type](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#type)
     * property.
     *
     * If a base class provides a `type` property, that will be returned. (If
     * this mixin is applied to a class defined by WrappedStandardElement, this
     * will return the `type` of the inner standard element.) Otherwise, the
     * default value of this property will be the same as the HTML tag name
     * registered for the custom element.
     *
     * @type {string}
     */
    get type() {
      // Defer to base class value.
      return super.type || this.localName;
    }

    get validationMessage() {
      return this[state].validationMessage;
    }

    get validity() {
      return this[nativeInternals].validity;
    }

    get willValidate() {
      return this[nativeInternals].willValidate;
    }
  }

  return FormElement;
}
