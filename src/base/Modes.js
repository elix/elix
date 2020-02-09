import * as internal from "./internal.js";
import * as template from "../core/template.js";
import ReactiveElement from "../core/ReactiveElement.js";
import SingleSelectionMixin from "./SingleSelectionMixin.js";
import SlotItemsMixin from "./SlotItemsMixin.js";

const Base = SingleSelectionMixin(SlotItemsMixin(ReactiveElement));

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
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      selectionRequired: true
    });
  }

  [internal.render](/** @type {PlainObject} */ changed) {
    super[internal.render](changed);
    if (changed.items || changed.selectedIndex) {
      const { selectedIndex, items } = this[internal.state];
      if (items) {
        items.forEach((item, index) => {
          const selected = index === selectedIndex;
          item.style.display = selected ? "" : "none";
        });
      }
    }
  }

  get [internal.template]() {
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

export default Modes;
