import { merge } from './updates.js';
import * as symbols from './symbols.js';
import * as template from './template.js';
import ComposedFocusMixin from './ComposedFocusMixin.js';
import FocusVisibleMixin from './FocusVisibleMixin.js';
import KeyboardMixin from './KeyboardMixin.js';
import WrappedStandardElement from './WrappedStandardElement.js';


const Base =
  ComposedFocusMixin(
  FocusVisibleMixin(
  KeyboardMixin(
    WrappedStandardElement.wrap('button')
  )));


/**
 * Base class for custom buttons.
 * 
 * `Button` wraps a standard HTML `button` element, allowing for custom styling
 * and behavior while ensuring standard keyboard and focus behavior.
 * 
 * @inherits WrappedStandardElement
 * @mixes ComposedFocusMixin
 * @mixes FocusVisibleMixin
 * @mixes KeyboardMixin
 */
class Button extends Base {

  get defaultState() {
    return Object.assign(super.defaultState, {
      role: 'button',
      treatEnterAsClick: true,
      treatSpaceAsClick: true
    });
  }

  // Pressing Enter or Space raises a click event, as if the user had clicked
  // the inner button.
  [symbols.keydown](event) {
    let handled;
    switch (event.key) {
      case ' ':
        if (this.state.treatSpaceAsClick) {
          this[symbols.click]();
          handled = true;
        }
        break;

      case 'Enter':
        if (this.state.treatEnterAsClick) {
          this[symbols.click]();
          handled = true;
        }
        break;        
    }

    // Prefer mixin result if it's defined, otherwise use base result.
    return handled || (super[symbols.keydown] && super[symbols.keydown](event));
  }

  // Respond to a simulated click.
  [symbols.click]() {
    const clickEvent = new MouseEvent('click');
    this.dispatchEvent(clickEvent);
  }

  get [symbols.template]() {
    return template.html`
      <style>
        :host {
          display: inline-flex;
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
        }
        
        #inner {
          align-items: center; /* Edge */
          color: inherit;
          display: inline-flex;
          flex: 1;
          font-family: inherit;
          font-size: inherit;
          font-style: inherit;
          font-weight: inherit;
          height: 100%;
          justify-content: center;
          padding: 0;
          position: relative;
          text-align: initial; /* Edge */
          width: 100%;
        }
      </style>

      <button id="inner" tabindex="-1" role="none">
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

    // Since it's the outer component that will typically get the keyboard
    // focus, we make the outer component visible as a button to ARIA, and hide
    // the inner button.
    const role = this.state.original && this.state.original.attributes.role ||
      base.attributes && base.attributes.role ||
      this.state.role;

    return merge(base, {
      attributes: {
        role
      },
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
