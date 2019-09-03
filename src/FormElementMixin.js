import * as symbols from './symbols.js';
import ReactiveElement from './ReactiveElement.js'; // eslint-disable-line no-unused-vars


const formElementsSupported = 'ElementInternals' in window;


/**
 * 
 * The mixin expects the component to define a `value` property.
 * 
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

    componentDidMount() {
      if (super.componentDidMount) { super.componentDidMount(); }
      updateValue(this);
    }

    componentDidUpdate(changed) {
      if (super.componentDidUpdate) { super.componentDidUpdate(changed); }
      if (changed.value) {
        updateValue(this);
      }
    }

    get defaultState() {
      return Object.assign(super.defaultState, {
        validationMessage: '',
        valid: true
      });
    }

    // Uncomment for debugging only
    // get internals() {
    //   return this[symbols.internals];
    // }

    static get formAssociated() {
      return true;
    }
    
    get form() {
      return this[symbols.internals].form;
    }

    get name() {
      return this.state.name;
    }
    set name(name) {
      if ('name' in Base.prototype) {
        super.name = name;
      }
      this.setState({
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
