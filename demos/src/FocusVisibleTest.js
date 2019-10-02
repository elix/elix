import * as internal from '../../src/internal.js';
import * as template from '../../src/template.js';
import FocusVisibleMixin from '../../src/FocusVisibleMixin.js';
import KeyboardMixin from '../../src/KeyboardMixin.js';
import WrappedStandardElement from '../../src/WrappedStandardElement.js';

const Base = FocusVisibleMixin(
  KeyboardMixin(WrappedStandardElement.wrap('button'))
);

class FocusVisibleTest extends Base {
  get [internal.template]() {
    return template.html`
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
