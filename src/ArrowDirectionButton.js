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

  get updates() {
    const style = Object.assign(
      {
        background: '',
        color: 'rgba(255, 255, 255, 0.7)'
      },
      this.state.hover && !this.state.innerAttributes.disabled && {
        background: 'rgba(255, 255, 255, 0.2)',
        color: 'rgba(255, 255, 255, 0.8)',
        cursor: 'pointer'
      },
      this.state.innerAttributes.disabled && {
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
        :host {
          display: flex;
          -webkit-tap-highlight-color: transparent;
        }
        
        #inner {
          background: transparent;
          border: none;
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
