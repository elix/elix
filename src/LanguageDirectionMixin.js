/**
 * Lets an element determine whether it resides in right-to-left text.
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
      /** @type {any} */ const element = this;
      const languageDirection = getComputedStyle(element).direction;
      this.setState({
        languageDirection
      });
    }

  }
}
