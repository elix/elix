import * as internal from '../../../src/internal.js';
import * as template from '../../../src/template.js';
import TabButton from '../../../src/TabButton.js';

class SereneTabButton extends TabButton {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      generic: false
    });
  }

  get [internal.template]() {
    return template.concat(
      super[internal.template],
      template.html`
      <style>
        :host {
          margin-left: 0;
        }

        #inner {
          background: #222;
          border: none;
          color: inherit;
          display: inline-block;
          font-size: 18px;
          margin: 0;
          padding: 0.5em 1em;
          touch-action: manipulation;
          transition: background 0.6s ease-out;
          -webkit-tap-highlight-color: transparent;
          white-space: nowrap;
        }

        :host(:hover) #inner {
          background: #444;
        }

        :host(.selected) #inner {
          background: #666;
        }
      </style>
    `
    );
  }
}

customElements.define('serene-tab-button', SereneTabButton);
export default SereneTabButton;
