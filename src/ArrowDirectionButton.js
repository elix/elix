import { merge } from './updates.js';
import * as symbols from './symbols.js';
import HoverMixin from './HoverMixin.js';
import WrappedStandardElement from './WrappedStandardElement.js';


const Base = 
  HoverMixin(
    WrappedStandardElement.wrap('button')
  );


/*
 * A button used by ArrowDirectionMixin for its left/right arrow buttons.
 * 
 * We don't expect this minor component to be used in other contexts, so it's
 * not documented as a supported Elix component.
 */
class ArrowDirectionButton extends Base {

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      disabled: false
    });
  }

  get disabled() {
    // @ts-ignore
    return super.disabled;
  }
  set disabled(disabled) {
    const parsed = disabled != null;
    // @ts-ignore
    super.disabled = parsed;
    this.setState({
      disabled: parsed
    });
  }

  get updates() {
    const style = Object.assign(
      {
        background: '',
        color: 'rgba(255, 255, 255, 0.7)'
      },
      this.state.hover && {
        background: 'rgba(255, 255, 255, 0.2)',
        color: 'rgba(255, 255, 255, 0.8)',
        cursor: 'pointer'
      },
      this.state.disabled && {
        background: '',
        color: 'rgba(255, 255, 255, 0.3)'
      }
    );
    return merge(super.updates, {
      style
    });
  }

  get [symbols.template]() {
    return `
      <style>
        :host(:not([hidden])) {
          display: flex;
        }
        
        #inner {
          background: transparent;
          border: 1px solid transparent;
          box-sizing: border-box;
          color: inherit;
          fill: currentColor;
          flex: 1;
          font-family: inherit;
          font-size: inherit;
          font-weight: inherit;
          margin: 0;
          outline: none;
          padding: 0;
          position: relative;
          transition: opacity 1s;
        }
      </style>
      <button id="inner">
        <slot></slot>
      </button>
    `;
  }

}


customElements.define('elix-arrow-direction-button', ArrowDirectionButton);
export default ArrowDirectionButton;
