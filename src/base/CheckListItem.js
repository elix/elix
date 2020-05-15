import { fragmentFrom } from "../core/htmlLiterals.js";
import ReactiveElement from "../core/ReactiveElement.js";
import {
  firstRender,
  ids,
  raiseChangeEvents,
  render,
  setState,
  state,
  template,
} from "./internal.js";
import SelectableMixin from "./SelectableMixin.js";

/**
 * A checkable item in a list.
 *
 * This component is designed to be used as a child inside a multi-select
 * list component like [MultiSelectListBox](MultiSelectListBox).
 *
 * @inherits ReactiveElement
 * @mixes SelectableMixin
 */
class CheckListItem extends SelectableMixin(ReactiveElement) {
  [render](changed) {
    super[render](changed);

    if (this[firstRender]) {
      // Prevent checkbox from getting focus.
      this[ids].checkbox.addEventListener("keydown", (event) => {
        event.preventDefault();
      });
      this[ids].checkbox.addEventListener("mousedown", (event) => {
        event.preventDefault();
      });

      // Checking the box toggles the selected state.
      this[ids].checkbox.addEventListener("change", () => {
        this[raiseChangeEvents] = true;
        /** @type {any} */ const checkbox = this[ids].checkbox;
        const selected = checkbox.checked;
        this[setState]({ selected });
        this[raiseChangeEvents] = false;
      });
    }

    // Render selected state as checked.
    if (changed.selected) {
      const { selected } = this[state];
      /** @type {any} */ const checkbox = this[ids].checkbox;
      checkbox.checked = selected;
    }
  }

  get [template]() {
    return fragmentFrom.html`
      <style>
        :host {
          display: grid;
          grid-template-columns: auto 1fr;
        }
      </style>
      <input id="checkbox" type="checkbox" role="none" tabindex="-1" />
      <slot></slot>
    `;
  }
}

export default CheckListItem;
