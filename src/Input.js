import * as symbols from './symbols.js';
import * as template from './template.js';
import WrappedStandardElement from './WrappedStandardElement.js';


const Base = WrappedStandardElement.wrap('input');


/**
 * Base class for custom input elements
 * 
 * `Input` wraps a standard HTML `input` element, allowing for custom styling
 * and behavior while ensuring standard keyboard and focus behavior.
 * 
 * @inherits WrappedStandardElement
 */
class Input extends Base {

  componentDidMount() {
    super.componentDidMount();

    // The following jsDoc comment doesn't directly apply to the statement which
    // follows, but is placed there because the comment has to go somewhere to
    // be visible to jsDoc, and the statement is at tangentially related.
    /**
     * Raised when the user changes the element's text content.
     * 
     * This is the standard `input` event; the component does not do any work to
     * raise it. It is documented here to let people know it is available to
     * detect when the user edits the content.
     * 
     * @event input
     */
    this.$.inner.addEventListener('input', () => {
      this[symbols.raiseChangeEvents] = true;
      // Invoke the value setter to fix up selectionStart/selectionEnd too.
      this.value = /** @type {any} */ (this.inner).value;
      this[symbols.raiseChangeEvents] = false;
    });

    this.setAttribute('role', 'none');
  }

  get [symbols.template]() {
    return template.html`
      <style>
        :host {
          display: inline-block;
        }
        
        #inner {
          box-sizing: border-box;
          font-family: inherit;
          font-size: inherit;
          font-style: inherit;
          font-weight: inherit;
          height: 100%;
          width: 100%;
        }
      </style>

      <input id="inner">
        <slot></slot>
      </input>
    `;
  }

  // Updating the value can also update the selectionStart and selectionEnd
  // properties, so we have to update our state to match.
  get value() {
    // @ts-ignore
    return super.value;
  }
  set value(value) {
    // @ts-ignore
    super.value = value;
    if (this.shadowRoot) {
      /** @type {any} */ const inner = this.inner;
      this.setInnerProperty('selectionStart', inner.selectionStart);
      this.setInnerProperty('selectionEnd', inner.selectionEnd);
    }
  }

}


export default Input;
customElements.define('elix-input', Input);
