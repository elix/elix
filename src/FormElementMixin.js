import * as symbols from './symbols.js';
import ReactiveElement from './ReactiveElement.js'; // eslint-disable-line no-unused-vars


const formElementsSupported = 'ElementInternals' in window;


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
      if (formElementsSupported) {
        this[symbols.internals] = this.attachInternals();
      }
    }
  
    checkValidity() {
      return this[symbols.internals].checkValidity();
    }

    [symbols.componentDidMount]() {
      if (super[symbols.componentDidMount]) { super[symbols.componentDidMount](); }
      updateValue(this);
    }

    componentDidUpdate(changed) {
      if (super.componentDidUpdate) { super.componentDidUpdate(changed); }
      if (changed.value) {
        updateValue(this);
      }
    }

    get [symbols.defaultState]() {
      return Object.assign(super[symbols.defaultState], {
        validationMessage: '',
        valid: true
      });
    }

    // Uncomment for debugging only
    get internals() {
      return this[symbols.internals];
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
      return this[symbols.internals].form;
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
      return this.state.name;
    }
    set name(name) {
      if ('name' in Base.prototype) {
        super.name = name;
      }
      this[symbols.setState]({
        name
      });
    }

    [symbols.render](changed) {
      if (super[symbols.render]) { super[symbols.render](changed); }

      // Reflect name property to attribute so form will pick it up.
      if (changed.name) {
        this.setAttribute('name', this.state.name);
      }

      if (formElementsSupported) {
          // Reflect validity state to internals.
        if (changed.valid || changed.validationMessage) {
          const { valid, validationMessage } = this.state;
          if (valid) {
            this[symbols.internals].setValidity({});
          } else {
            this[symbols.internals].setValidity(
              {
                customError: true
              },
              validationMessage
            );
          }
        }
      }
    }

    reportValidity() {
      return this[symbols.internals].reportValidity();
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
      return this.state.validationMessage;
    }

    get validity() {
      return this[symbols.internals].validity;
    }

    get willValidate() {
      return this[symbols.internals].willValidate;
    }
  
  }

  return FormElement;
}


function updateValue(element) {
  if (formElementsSupported) {
    element[symbols.internals].setFormValue(element.state.value, element.state);
  }
}
