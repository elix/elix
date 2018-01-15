import FocusVisibleMixin from '../../src/FocusVisibleMixin.js';
import symbols from '../../src/symbols.js';
import WrappedStandardElement from '../../src/WrappedStandardElement.js';


const Base =
  FocusVisibleMixin(
    WrappedStandardElement.wrap('button')
  );

class FocusVisibleTest extends Base {

  get [symbols.template]() {
    return `
      <style>
        :host {
          display: inline-block;
        }

        #inner {
          background: #888;
          border-radius: 3px;
          color: #eee;
          font-family: inherit;
          font-size: inherit;
          font-style: inherit;
          font-weight: inherit;
          outline: none;
          padding: 6px 12px;
        }
      </style>
      <button id="inner" tabindex="-1">
        <slot></slot>
      </button>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('tabindex', '0');
  }

}


customElements.define('focus-visible-test', FocusVisibleTest);
export default FocusVisibleTest;
