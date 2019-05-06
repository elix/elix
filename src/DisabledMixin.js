/**
 * Tracks the disabled state of a component that can be disabled
 * 
 * @module DisabledMixin
 */
export default function DisabledMixin(Base) {

  // The class prototype added by the mixin.
  class Disabled extends Base {

    componentDidMount() {
      if (super.componentDidMount) { super.componentDidMount(); }
      reflectDisabledAttribute(this);
    }

    componentDidUpdate(changed) {
      if (super.componentDidUpdate) { super.componentDidUpdate(changed); }
      if (changed.disabled) {
        reflectDisabledAttribute(this);
      }
    }

    get defaultState() {
      return Object.assign(super.defaultState, {
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
      return this.state.disabled;
    }
    set disabled(disabled) {
      // If the supplied value is a boolean, we accept it directly. If the
      // supplied value is a string, it was presumably set via an attribute. In
      // that case, any non-null value counts as true.
      const parsed = typeof disabled === 'boolean' ?
        disabled :
        disabled !== null;
      // Setting the disabled state will eventually cause the property value to
      // be reflected to the disabled attribute, which will invoke this setter
      // again -- this time, with a string value. That string value should get
      // parsed the same way, so the second setState call shouldn't have any
      // effect.
      this.setState({
        disabled: parsed
      });
    }

  }

  return Disabled;
}


// Reflect value of disabled property to the corresponding attribute.
function reflectDisabledAttribute(element) {
  element.toggleAttribute('disabled', element.disabled);
}
