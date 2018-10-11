import { merge } from './updates.js';
import * as symbols from './symbols.js';
import * as template from './template.js';
import FocusVisibleMixin from './FocusVisibleMixin.js';
import KeyboardMixin from './KeyboardMixin.js';
import WrappedStandardElement from './WrappedStandardElement.js';


const Base =
  FocusVisibleMixin(
  KeyboardMixin(
    WrappedStandardElement.wrap('button')
  ));


/**
 * Base class for custom buttons.
 * 
 * `Button` wraps a standard HTML `button` element, allowing for custom styling
 * and behavior while ensuring standard keyboard and focus behavior.
 * 
 * @inherits WrappedStandardElement
 * @mixes FocusVisibleMixin
 * @mixes KeyboardMixin
 */
class Button extends Base {

  componentDidMount() {
    if (super.componentDidMount) { super.componentDidMount(); }

    // As of Oct 2018, browsers don't seem to do a good job dealing with
    // clicks on light DOM nodes assigned to a slot in a focusable element
    // like a button. We work around those limitations.
    this.addEventListener('mousedown', event => {
      /** @type {any} */
      const cast = event;
      const target = cast.target;
      const containsTarget = this === target || this.shadowRoot.contains(target);
      if (!containsTarget) {
        // The user must be clicking/tapping on an element in the light DOM
        // that's assigned to this element's slot.

        // If this element can receive the focus, ensure it gets it.
        const canReceiveFocus = this.tabIndex >= 0;
        if (canReceiveFocus) {
          this.focus();
        }
  
        // The browser will try to steal the focus from the button; prevent
        // that.
        event.preventDefault();
      }
    });
  }

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
    return template.html`
      <style>
        :host {
          display: inline-flex;
          -webkit-tap-highlight-color: transparent;
        }
        
        #inner {
          background: none;
          border: none;
          color: inherit;
          flex: 1;
          font-family: inherit;
          font-size: inherit;
          font-weight: inherit;
          height: 100%;
          padding: 0;
          position: relative;
          width: 100%;
        }
      </style>

      <button id="inner" tabindex="-1">
        <slot></slot>
      </button>
    `;
  }

  get updates() {
    const base = super.updates || {};

    const baseInnerStyle = base.$ && base.$.inner && base.$.inner.style;
    const outline = baseInnerStyle && baseInnerStyle.outline ||
      !this.state.focusVisible && 'none' ||
      undefined;

    return merge(base, {
      $: {
        inner: {
          style: {
            outline
          }
        }
      }
    });
  }
}


customElements.define('elix-button', Button);
export default Button;
