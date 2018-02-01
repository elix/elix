import { merge } from '../../src/updates.js';
import * as symbols from '../../src/symbols.js';
import FocusVisibleMixin from '../../src/FocusVisibleMixin.js';
import WrappedStandardElement from '../../src/WrappedStandardElement.js';


const Base =
  FocusVisibleMixin(
    WrappedStandardElement.wrap('button')
  );


class CustomButton extends Base {

  get [symbols.template]() {
    return `
      <style>
        :host {
          display: inline-block;
        }
        
        button {
          background: white;
          border-radius: 0.5em;
          border: 2px solid rgba(255, 0, 0, 0.2);
          font-family: inherit;
          font-size: inherit;
          font-weight: inherit;
          height: 100%;
          padding: 0.5em 1em;
          width: 100%;
        }
      </style>

      <button id="inner" tabindex="0">
        <slot></slot>
      </button>
    `;
  }

  get updates() {
    const base = super.updates || {};
    const baseInnerStyle = base.$ && base.$.inner && base.$.inner.style
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


customElements.define('custom-button', CustomButton);
export default CustomButton;
