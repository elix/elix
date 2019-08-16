import * as symbols from './symbols.js';


const formElementsSupported = 'ElementInternals' in window;


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
      return this.internals_.checkValidity();
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
        value: null
      });
    }

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
    }

    reportValidity() {
      return this[symbols.internals].reportValidity();
    }

    get type() {
      return this.localName;
    }

    get validationMessage() {
      return this[symbols.internals].validationMessage;
    }

    get validity() {
      return this[symbols.internals].validity;
    }

    /**
     * The element's current value.
     *
     * If the element is associated with an HTML form, this `value` is what the
     * element will contribute to the data submitted with the form.
     *
     * @type {string}
     */
    get value() {
      return this.state.value;
    }
    set value(value) {
      this.setState({
        value
      });
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