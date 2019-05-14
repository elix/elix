import * as symbols from './symbols.js';
import * as template from './template.js';
import ReactiveElement from './ReactiveElement.js';
import SingleSelectionMixin from './SingleSelectionMixin.js';
import SlotItemsMixin from './SlotItemsMixin.js';


const Base =
  SingleSelectionMixin(
  SlotItemsMixin(
    ReactiveElement
  ));


/**
 * Shows a single panel at a time
 * 
 * This can be useful when a given UI element has multiple modes that present
 * substantially different elements, or for displaying a single item from a set
 * at a time.
 *
 * This component doesn't provide any UI for changing which mode is shown. A
 * common pattern in which buttons select the mode are tabs, a pattern
 * implemented by the [Tabs](Tabs) component.
 *
 * @inherits ReactiveElement
 * @mixes SingleSelectionMixin
 * @mixes SlotItemsMixin
 */
class Modes extends Base {

  get defaultState() {
    return Object.assign(super.defaultState, {
      selectionRequired: true
    });
  }

  [symbols.render](changed) {
    super[symbols.render](changed);
    if (changed.items || changed.selectedIndex) {
      const { selectedIndex, items } = this.state;
      if (items) {
        items.forEach((item, index) => {
          const selected = index === selectedIndex;
          item.style.display = selected ? null : 'none';
        });
      }
    }
  }

  get [symbols.template]() {
    return template.html`
      <style>
        :host {
          display: inline-flex;
        }
        
        #modesContainer {
          display: flex;
          flex: 1;
          position: relative;
        }
      </style>
      <div id="modesContainer">
        <slot></slot>
      </div>
    `;
  }

}


customElements.define('elix-modes', Modes);
export default Modes;
