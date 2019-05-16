/**
 * Lets an element determine whether it resides in right-to-left text.
 *
 * @module LanguageDirectionMixin
 */
export default function LanguageDirectionMixin(Base) {

  // The class prototype added by the mixin.
  return class LanguageDirection extends Base {

    // The only way to get text direction is to wait for the component to
    // connect and then inspect the computed style on its root element. We set
    // state before calling super so the new state will be included when
    // ReactiveMixin calls render.
    connectedCallback() {
      /** @type {any} */ const element = this;
      const languageDirection = getComputedStyle(element).direction;
      const rightToLeft = languageDirection === 'rtl';
      this.setState({
        rightToLeft
      });
      if (super.connectedCallback) { super.connectedCallback(); }
    }

  }
}
