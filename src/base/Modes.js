import ReactiveElement from "../core/ReactiveElement.js";
import * as template from "../core/template.js";
import CursorAPIMixin from "./CursorAPIMixin.js";
import * as internal from "./internal.js";
import ItemsAPIMixin from "./ItemsAPIMixin.js";
import ItemsCursorMixin from "./ItemsCursorMixin.js";
import SingleSelectAPIMixin from "./SingleSelectAPIMixin.js";
import SlotItemsMixin from "./SlotItemsMixin.js";

const Base = CursorAPIMixin(
  ItemsAPIMixin(
    ItemsCursorMixin(SingleSelectAPIMixin(SlotItemsMixin(ReactiveElement)))
  )
);

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
 * @mixes SingleSelectAPIMixin
 * @mixes SlotItemsMixin
 */
class Modes extends Base {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      currentItemRequired: true,
    });
  }

  [internal.render](/** @type {ChangedFlags} */ changed) {
    super[internal.render](changed);
    if (changed.items || changed.currentIndex) {
      const { currentIndex, items } = this[internal.state];
      if (items) {
        items.forEach((item, index) => {
          const selected = index === currentIndex;
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
