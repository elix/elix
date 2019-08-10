
const formElementsSupported = 'ElementInternals' in window;


export default function FormElementMixin(Base) {

  // The class prototype added by the mixin.
  class FormElement extends Base {

    constructor() {
      super();
      if (formElementsSupported) {
        this._internals = this.attachInternals();
        updateValue(this);
      }
    }

    // TODO: Also componentDidMount
    componentDidUpdate(changed) {
      if (super.componentDidUpdate) { super.componentDidUpdate(changed); }
      if (changed.value) {
        updateValue(this);
      } 
    }

    static get formAssociated() {
      return true;
    }

  }

  return FormElement;
}


function updateValue(element) {
  if (formElementsSupported) {
    element._internals.setFormValue(element.state.value, element.state);
  }
}