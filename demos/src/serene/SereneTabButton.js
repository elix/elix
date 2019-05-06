import * as symbols from '../../../src/symbols.js';
import * as template from '../../../src/template.js';
import HoverMixin from '../../../src/HoverMixin.js';
import TabButton from '../../../src/TabButton.js';


const Base =
  HoverMixin(
    TabButton
  );


class SereneTabButton extends Base {

  [symbols.render](state, changed) {
    super[symbols.render](state, changed);
    if (changed.hover || changed.selected) {
      this.$.inner.style.backgroundColor = state.selected ?
        '#666' :
        state.hover ?
          '#444' :
          '#222';
    }
  }

  get [symbols.template]() {
    return template.concat(super[symbols.template], template.html`
      <style>
        :host {
          margin-left: 0;
        }

        #inner {
          border: none;
          border-radius: 0;
          color: inherit;
          display: inline-block;
          font-size: 18px;
          margin: 0;
          outline: none;
          padding: 0.5em 1em;
          touch-action: manipulation;
          transition: background 0.6s ease-out;
          -webkit-tap-highlight-color: transparent;
          white-space: nowrap;
        }
      </style>
    `);
  }

}


customElements.define('serene-tab-button', SereneTabButton);
export default SereneTabButton;
