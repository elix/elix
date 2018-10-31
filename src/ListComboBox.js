// import { apply, merge } from './updates.js';
import { getSuperProperty } from './workarounds.js';
import * as symbols from './symbols.js';
import * as template from './template.js';
import ComboBox from './ComboBox.js';
import './ListBox.js';


// TODO: Roles
class ListComboBox extends ComboBox {

  get [symbols.template]() {
    // Next line is same as: const result = super[symbols.template]
    const result = getSuperProperty(this, ListComboBox, symbols.template);

    // Wrap default slot with a list.
    const listTemplate = template.html`
      <style>
        #list {
          border: none;
        }
      </style>
      <elix-list-box id="list">
        <slot></slot>
      </elix-list-box>
    `;
    const defaultSlot = template.defaultSlot(result.content);
    if (defaultSlot) {
      template.transmute(defaultSlot, listTemplate);
    }

    return result;
  }
}


export default ListComboBox;
customElements.define('elix-list-combo-box', ListComboBox);
