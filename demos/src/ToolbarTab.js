import { defaultState, template } from "../../src/base/internal.js";
import TabButton from "../../src/base/TabButton.js";
import { templateFrom } from "../../src/core/htmlLiterals.js";

class ToolbarTab extends TabButton {
  // @ts-ignore
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      generic: false,
    });
  }

  get [template]() {
    const result = super[template];
    result.content.append(
      templateFrom.html`
        <style>
          :host([selected]) {
            color: dodgerblue;
            z-index: 1;
          }

          [part~="button"] {
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
