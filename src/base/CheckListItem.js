import ReactiveElement from "../core/ReactiveElement.js";
import * as template from "../core/template.js";
import * as internal from "./internal.js";
import SelectableMixin from "./SelectableMixin.js";

/**
 * A checkable item in a list
 *
 * @inherits ReactiveElement
 * @mixes SelectableMixin
 */
class CheckListItem extends SelectableMixin(ReactiveElement) {
  [internal.render](changed) {
    super[internal.render](changed);

    if (this[internal.firstRender]) {
      // Disable default click behavior on check box.
      this[internal.ids].checkbox.addEventListener("click", (event) => {
        event.preventDefault();
      });
    }

    // Render selected state as checked.
    if (changed.selected) {
      const { selected } = this[internal.state];
      /** @type {any} */ const checkbox = this[internal.ids].checkbox;
      checkbox.checked = selected;
    }
  }

  get [internal.template]() {
    return template.html`
      <style>
        :host {
          display: grid;
          grid-template-columns: auto 1fr;
        }
      </style>
      <input id="checkbox" type="checkbox" role="none" tabindex="-1">
      <slot></slot>
    `;
  }
}

export default CheckListItem;
