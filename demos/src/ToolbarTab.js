import * as internal from "../../src/base/internal.js";
import * as template from "../../src/core/template.js";
import TabButton from "../../src/base/TabButton.js";

class ToolbarTab extends TabButton {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      generic: false
    });
  }

  get [internal.template]() {
    const result = super[internal.template];
    result.content.append(
      template.html`
        <style>
          :host([selected]) {
            color: dodgerblue;
            z-index: 1;
          }

          [part~="inner"] {
            align-items: center;
            background: transparent;
            border: none;
            display: flex;
            flex: 1;
            flex-direction: column;
            font: inherit;
            padding: 6px;
            -webkit-tap-highlight-color: transparent;
          }
        </style>
      `.content
    );
    return result;
  }
}

customElements.define("toolbar-tab", ToolbarTab);
export default ToolbarTab;
