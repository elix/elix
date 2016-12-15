import SimpleAttribute from '../../elix-mixins/src/SimpleAttribute';
import SimpleTemplate from '../../elix-mixins/src/SimpleTemplate';

/**
 * A simple element
 *
 * [Live demo](http://elix.org/elix/elements/elix-simple-element/)
 *
 * This is a simple element.
 *
 * @mixes SimpleAttribute
 * @mixes SimpleTemplate
 */
class SimpleElement extends SimpleTemplate(SimpleAttribute(HTMLElement)) {
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