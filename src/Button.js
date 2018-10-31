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

    this.addEventListener('mousedown', event => {

      // If this element can receive the focus, ensure it gets it. As of Oct
      // 2018, Safari and Firefox don't do this automatically. Chrome doesn't
      // need this, but it doesn't appear to hurt either.
      const canReceiveFocus = this.tabIndex >= 0;
      if (canReceiveFocus) {
        this.focus();
      }

      // As of Oct 2018, browsers don't seem to do a good job dealing with
      // clicks on light DOM nodes assigned to a slot in a focusable element
      // like a button. We work around those limitations.
      /** @type {any} */
      const cast = event;
      const target = cast.target;
      const containsTarget = this === target || this.shadowRoot.contains(target);
      if (!containsTarget) {
        // The user must be clicking/tapping on an element in the light DOM
        // that's assigned to this element's slot. The browser will try to steal
        // the focus from the button; prevent that.
        event.preventDefault();
      }
    });
  }

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      role: 'button'
    });
  }

  // Pressing Enter or Space raises a click event, as if the user had clicked
  // the inner button.
  [symbols.keydown](event) {
    let handled;
    switch (event.key) {
      case ' ':
      case 'Enter':
        this[symbols.click]();
        handled = true;
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
        }
        
        #inner {
          align-items: center; /* Edge */
          background: none;
          border: none;
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
