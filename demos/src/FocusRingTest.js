import FocusRingMixin from '../../mixins/FocusRingMixin.js';
import symbols from '../../mixins/symbols.js';
import WrappedStandardElement from '../../elements/WrappedStandardElement.js';


const Base =
  FocusRingMixin(
    WrappedStandardElement.wrap('button')
  );

class FocusRingTest extends Base {

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


customElements.define('focus-ring-test', FocusRingTest);
export default FocusRingTest;
