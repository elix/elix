import FocusRingMixin from '../../mixins/FocusRingMixin.js';
import ShadowTemplateMixin from '../../mixins/ShadowTemplateMixin.js';
import symbols from '../../mixins/symbols.js';


class ToolbarTab extends FocusRingMixin(ShadowTemplateMixin(HTMLElement)) {
  [symbols.template](filler) {
    return `
      <style>
        :host {
          display: flex;
        }

        :host(:focus:not(.focus-ring)) {
          outline: none;
        }

        button {
          align-items: center;
          background: transparent;
          border: none;
          color: inherit;
          display: flex;
          flex: 1;
          flex-direction: column;
          font-family: inherit;
          font-size: inherit;
          outline: none;
          padding: 6px;
        }

        :host(.selected) button,
        :host(.selected) ::slotted(*) {
          color: dodgerblue;
        }
      </style>

      <button tabindex="-1">
        ${filler || `<slot></slot>`}
      </button>
    `;
  }
}


customElements.define('toolbar-tab', ToolbarTab);
export default ToolbarTab;
