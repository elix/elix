import * as symbols from '../../src/symbols.js';
import * as template from '../../src/template.js';
import TabButton from '../../src/TabButton.js';


class ToolbarTab extends TabButton {

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      overlapPanel: false
    });
  }

  [symbols.render](state, changed) {
    super[symbols.render](state, changed);
    if (changed.index || changed.languageDirection ||
      changed.overlapPanel || changed.position) {
      this.$.inner.style.margin = null;
    }
    if (changed.position) {
      this.$.inner.style.borderRadius = null;
    }
    if (changed.position || changed.selected) {
      this.$.inner.style.borderColor = null;
    }
    if (changed.innerProperties || changed.original || changed.selected) {
      Object.assign(this.$.inner.style, {
        backgroundColor: 'transparent',
        color: state.selected ? 'dodgerblue' : null
      });
    }
  }

  get [symbols.template]() {
    return template.concat(super[symbols.template], template.html`
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
      </style>
    `);
  }

}


customElements.define('toolbar-tab', ToolbarTab);
export default ToolbarTab;
