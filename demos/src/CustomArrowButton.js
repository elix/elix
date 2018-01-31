import { merge } from '../../src/updates.js';
import * as symbols from '../../src/symbols.js';
import HoverMixin from '../../src/HoverMixin.js';
import WrappedStandardElement from '../../src/WrappedStandardElement.js';


const Base = 
  HoverMixin(
    WrappedStandardElement.wrap('button')
  );


class CustomArrowButton extends Base {

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      disabled: false
    });
  }

  get disabled() {
    return super.disabled;
  }
  set disabled(disabled) {
    super.disabled = disabled;
    this.setState({
      disabled: super.disabled
    });
  }

  get updates() {

    const style = Object.assign(
      {
        background: 'rgba(255, 255, 255, 0.2)',
        'border-color': 'rgba(255, 255, 255, 0.7)',
        color: 'rgba(255, 255, 255, 0.7)',
        transform: 'scale(1.0)'
      },
      this.state.hover && {
        background: 'rgba(255, 255, 255, 0.5)',
        'border-color': 'rgba(255, 255, 255, 0.8)',
        color: 'rgba(255, 255, 255, 0.8)',
        cursor: 'pointer',
        transform: 'scale(1.1)'
      },
      this.state.disabled && {
        background: '',
        'border-color': 'rgba(255, 255, 255, 0.2)',
        color: 'rgba(255, 255, 255, 0.2)',
        cursor: '',
        transform: 'scale(1.0)'
      }
    );

    return merge(super.updates, {
      $: {
        inner: { style }
      }
    });
  }

  get [symbols.template]() {
    return `
      <style>
        :host {
          display: flex;
          flex-direction: column;
          justify-content: center;
          -webkit-tap-highlight-color: transparent;
        }
        
        #inner {
          background: transparent;
          border: 2px solid transparent;
          box-sizing: border-box;
          color: inherit;
          fill: currentColor;
          font-family: inherit;
          font-size: 28px;
          font-weight: bold;
          height: 48px;
          margin: 0.5em;
          width: 48px;
          outline: none;
          padding: 0;
          position: relative;
          transition: background 0.3s, border-color 0.3s, color 0.3s, transform 0.3s;
          width: 48px;
        }
      </style>
      <button id="inner">
        <slot></slot>
      </button>
    `;
  }

}


customElements.define('custom-arrow-button', CustomArrowButton);
export default CustomArrowButton;
