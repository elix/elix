/**
 * Mixin that helps an element determine whether it's in the context of
 * right-to-left text.
 *
 * @module LanguageDirectionMixin
 */
export default function LanguageDirectionMixin(Base) {

  // The class prototype added by the mixin.
  return class LanguageDirection extends Base {

    // The only way to get text direction is to wait for the component to mount
    // and then inspect the computed style on its root element. This
    // unfortunately means that, in a right-to-left language, the component will
    // end up rendering twice.
    componentDidMount() {
      if (super.componentDidMount) { super.componentDidMount(); }
      /** @type {any} */
      const element = this;
      const languageDirection = getComputedStyle(element).direction;
      if (this.state.languageDirection !== languageDirection) {
        this.setState({ languageDirection });
      }
    }

    /**
     * Returns true if the if the element is rendered right-to-left (the element
     * has or inherits a `dir` attribute with the value `rtl`).
     * 
     * This property wraps the internal state member `state.languageDirection`,
     * and is true if that member equals the string "rtl".
     * 
     * @returns {boolean}
     */
    get rightToLeft() {
      return this.state.languageDirection === 'rtl';
    }

  }
}
