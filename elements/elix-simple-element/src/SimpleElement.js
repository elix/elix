import SimpleAttributeMixin from '../../elix-mixins/src/SimpleAttributeMixin';
import SimpleTemplateMixin from '../../elix-mixins/src/SimpleTemplateMixin';


/**
 * A simple element used to demonstrate the build and documentation process.
 *
 * [Live demo](http://elix.org/elix/elements/elix-simple-element/)
 *
 * @module SimpleElement
 * @mixes SimpleAttributeMixin
 * @mixes SimpleTemplateMixin
 */
class SimpleElement extends SimpleTemplateMixin(SimpleAttributeMixin(HTMLElement)) {

  /**
   * Specifies the greeting.
   *
   * @type {string}
   * @default greeting
   */
  get greeting() {
    return this.shadowRoot.getElementById('greeting').textContent;
  }
  set greeting(value) {
    this.shadowRoot.getElementById('greeting').textContent = value;
  }

  static get observedAttributes() {
    return ['greeting'];
  }

  get template() {
    return `<span id="greeting">Hello</span>, <slot></slot>.`;
  }
}

customElements.define('elix-simple-element', SimpleElement);
export default SimpleElement;
