import * as internal from '../../src/internal.js';
import * as template from '../../src/template.js';
import TabButton from '../../src/TabButton.js';

class ToolbarTab extends TabButton {
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
        #inner {
          align-items: center;
          background: transparent;
          border: none;
          display: flex;
          flex: 1;
          flex-direction: column;
          font-family: inherit;
          font-size: inherit;
          padding: 6px;
          -webkit-tap-highlight-color: transparent;
        }

        :host(.selected) {
          color: dodgerblue;
          z-index: 1;
        }
      </style>
    `
    );
  }
}

customElements.define('toolbar-tab', ToolbarTab);
export default ToolbarTab;
