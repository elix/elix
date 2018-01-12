import ReactiveMixin from '../../src/ReactiveMixin.js';
import symbols from '../../src/symbols.js';


// Create a native web component with reactive behavior.
class IncrementDecrement extends ReactiveMixin(HTMLElement) {

  // Allow the value property to be set via an attribute.
  attributeChangedCallback(attributeName, oldValue, newValue) {
    if (attributeName === 'value') {
      this.value = parseInt(newValue);
    }
  }

  // This property becomes the value of this.state at constructor time.
  get defaultState() {
    return Object.assign({}, super.defaultState, {
      value: 0
    });
  }

  // Expose "value" as an attribute.
  static get observedAttributes() {
    return ['value'];
  }

  // Provide a public property that gets/sets state.
  get value() {
    return this.state.value;
  }
  set value(value) {
    this.setState({ value });
  }

  // Render the current state to the DOM.
  //
  // ReactiveMixin invokes this method when the state changes. This method
  // would typically invoke a rendering engine (virtual-dom, lit-html,
  // etc.).
  //
  // In this example, we'll just populate the DOM with an HTML template,
  // then update the DOM directly with DOM API calls. This isn't actually
  // too bad, and is the fastest possible way to render state to the DOM.
  [symbols.render]() {
    if (!this.shadowRoot) {
      // First time we render, create the shadow subtree.
      const root = this.attachShadow({ mode: 'open' });
      const template = document.createElement('template');
      template.innerHTML = `
        <button id="decrement">-</button>
        <span id="value"></span>
        <button id="increment">+</button>
      `;
      const clone = document.importNode(template.content, true);
      root.appendChild(clone);
      // Wire up event handlers.
      root.querySelector('#decrement').addEventListener('click', () => {
        this.value--;
      });
      root.querySelector('#increment').addEventListener('click', () => {
        this.value++;
      });
    }
    // Render the state into the shadow.
    this.shadowRoot.querySelector('#value').textContent = this.state.value;
  }

}


customElements.define('increment-decrement', IncrementDecrement);
