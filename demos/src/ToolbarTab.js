import ShadowTemplateMixin from '../../mixins/ShadowTemplateMixin';
import symbols from '../../mixins/symbols';


class ToolbarTab extends ShadowTemplateMixin(HTMLElement) {
  get [symbols.template]() {
    return `
      <style>
        :host {
          display: flex;
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
          padding: 6px;
        }

        :host(.selected) button,
        :host(.selected) ::slotted(*) {
          color: dodgerblue;
        }
      </style>

      <button tabindex="-1">
        <slot></slot>
      </button>
    `;
  }
}


customElements.define('toolbar-tab', ToolbarTab);
export default ToolbarTab;
