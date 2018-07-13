import * as symbols from './symbols.js';
import FocusVisibleMixin from './FocusVisibleMixin.js';
import KeyboardMixin from './KeyboardMixin.js';
import WrappedStandardElement from './WrappedStandardElement.js';


const Base =
  FocusVisibleMixin(
  KeyboardMixin(
    WrappedStandardElement.wrap('button')
  ));


/**
 * A button with no border or background in its normal state, generally used for
 * clickable subelements inside a more complex component.
 * 
 * @inherits WrappedStandardElement
 * @mixes FocusVisibleMixin
 * @mixes KeyboardMixin
 */
class SeamlessButton extends Base {

  // Pressing Enter or Space is the same as clicking the button.
  [symbols.keydown](event) {
    /** @type {any} */
    const button = this.inner;
    
    let handled;
    switch (event.key) {
      case ' ':
      case 'Enter':
        button.click();
        handled = true;
        break;
    }

    // Prefer mixin result if it's defined, otherwise use base result.
    return handled || (super[symbols.keydown] && super[symbols.keydown](event));
  }

  get [symbols.template]() {
    return `
      <style>
        :host {
          display: inline-flex;
          -webkit-tap-highlight-color: transparent;
        }
        
        button {
          background: none;
          border: none;
          flex: 1;
          font-family: inherit;
          font-size: inherit;
          font-weight: inherit;
          padding: 0;
          position: relative;
        }
      </style>

      <button id="inner" tabindex="-1">
        <slot></slot>
      </button>
    `;
  }

}


customElements.define('elix-seamless-button', SeamlessButton);
export default SeamlessButton;
