import { templateFrom } from "../core/htmlLiterals.js";
import ReactiveElement from "../core/ReactiveElement.js";
import CursorAPIMixin from "./CursorAPIMixin.js";
import CursorSelectMixin from "./CursorSelectMixin.js";
import { defaultState, render, state, template } from "./internal.js";
import ItemsAPIMixin from "./ItemsAPIMixin.js";
import ItemsCursorMixin from "./ItemsCursorMixin.js";
import SingleSelectAPIMixin from "./SingleSelectAPIMixin.js";
import SlotItemsMixin from "./SlotItemsMixin.js";

const Base = CursorAPIMixin(
  CursorSelectMixin(
    ItemsAPIMixin(
      ItemsCursorMixin(SingleSelectAPIMixin(SlotItemsMixin(ReactiveElement)))
    )
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
 * @mixes CursorAPIMixin
 * @mixes CursorSelectMixin
 * @mixes ItemsAPIMixin
 * @mixes ItemsCursorMixin
 * @mixes SingleSelectAPIMixin
 * @mixes SlotItemsMixin
 */
class Modes extends Base {
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      currentItemRequired: true,
    });
  }

  [render](/** @type {ChangedFlags} */ changed) {
    super[render](changed);
    if (changed.items || changed.currentIndex) {
      const { currentIndex, items } = this[state];
      if (items) {
        items.forEach((item, index) => {
          const selected = index === currentIndex;
          item.style.display = selected ? "" : "none";
        });
      }
    }
  }

  get [template]() {
    return templateFrom.html`
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
