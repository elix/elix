import * as symbols from './symbols.js';
import * as template from './template.js';
import AriaRoleMixin from './AriaRoleMixin.js';
import ComposedFocusMixin from './ComposedFocusMixin.js';
import FocusVisibleMixin from './FocusVisibleMixin.js';
import KeyboardMixin from './KeyboardMixin.js';
import WrappedStandardElement from './WrappedStandardElement.js';


const Base =
  AriaRoleMixin(
  ComposedFocusMixin(
  FocusVisibleMixin(
  KeyboardMixin(
    WrappedStandardElement.wrap('button')
  ))));


// Do we need to explicitly map Space/Enter keys to a button click?
//
// As of February 2019, Firefox automatically translates a Space/Enter key on a
// button into a click event that bubbles to its host. Chrome/Safari do not do
// this automatically, so we have to do it ourselves.
//
// It's gross to look for a specific browser (Firefox), but it seems extremely
// hard to feature-detect this. Even if we try to create a button in a shadow at
// runtime and send a key event to it, Chrome/Safari don't seem to do their
// normal mapping of Space/Enter to a click for synthetic keyboard events.
//
// Firefox detection adapted from https://stackoverflow.com/a/9851769/76472
// and adjusted to pass type checks.
const firefox = 'InstallTrigger' in window;
const mapKeysToClick = !firefox;


/**
 * Base class for custom buttons.
 * 
 * `Button` wraps a standard HTML `button` element, allowing for custom styling
 * and behavior while ensuring standard keyboard and focus behavior.
 * 
 * @inherits WrappedStandardElement
 * @mixes AriaRoleMixin
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
  // TODO: Space should raise the click on *keyup*.
  [symbols.keydown](event) {
    let handled;
    if (mapKeysToClick) {
      switch (event.key) {
        case ' ':
          if (this.state.treatSpaceAsClick) {
            this[symbols.tap]();
            handled = true;
          }
          break;

        case 'Enter':
          if (this.state.treatEnterAsClick) {
            this[symbols.tap]();
            handled = true;
          }
          break;
      }
    }

    // Prefer mixin result if it's defined, otherwise use base result.
    return handled || (super[symbols.keydown] && super[symbols.keydown](event));
  }

  [symbols.render](changed) {
    super[symbols.render](changed);
    if (changed.focusVisible) {
      // Override host `outline` style supplied by FocusVisibleMixin.
      this.style.outline = 'none';
      const { focusVisible } = this.state;
      this.$.inner.style.outline = focusVisible ? '' : 'none';
    }
  }

  // Respond to a simulated click.
  [symbols.tap]() {
    const clickEvent = new MouseEvent('click');
    this.dispatchEvent(clickEvent);
  }

  get [symbols.template]() {
    return template.html`
      <style>
        :host {
          display: inline-flex;
          outline: none;
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

      <button id="inner" role="none">
        <slot></slot>
      </button>
    `;
  }

}


customElements.define('elix-button', Button);
export default Button;
