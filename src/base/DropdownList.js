import { fragmentFrom } from "../core/htmlLiterals.js";
import { defaultState, ids, render, state, template, setState, raiseChangeEvents, } from "./internal.js";
import ItemsTextMixin from "./ItemsTextMixin.js";
import ListComboBox from "./ListComboBox.js";

const Base = ItemsTextMixin(ListComboBox);

/**
 * A combo box that auto-completes the user's input against the list items
 *
 * @inherits ListComboBox
 * @mixes ItemsTextMixin
 * @part { div } input
 */
class DropdownList extends Base {
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      inputPartType: 'div',
      value: 'foo'
    });
  }

  [render](/** @type {ChangedFlags} */ changed) {
    super[render](changed);
    if (changed.value) {
      const { value } = this[state];
      /** @type {any} */ (this[ids].input).innerHTML = value;
    }

    this[ids].input.addEventListener("focus", () => {
      this[raiseChangeEvents] = true;
      /** @type {any} */
      const cast = this[ids].input;
      const value = cast.innerHTML;
      /** @type {PlainObject} */ const changes = {
        value,
        selectText: false,
      };
      if (this.closed && value > "") {
        // If user types while popup is closed, implicitly open it.
        changes.opened = true;
      }
      this[setState](changes);
      this[raiseChangeEvents] = false;
    });
  }

  get [template]() {
    const result = super[template];

    const sourceSlot = result.content.querySelector('slot[name="source"]');
    if (sourceSlot) {
      sourceSlot.replaceWith(fragmentFrom.html`
        <label id="label" part="label" for="input"></label>
        <div id="input" part="input"></input>
        <div id="popupToggle" part="popup-toggle"></div>
      `);
    }

    result.content.append(
      fragmentFrom.html`
        <style>
          [part~="input"] {
            /* temporary styling */
            min-width: 10em;
          }
        </style>
      `
    );
    return result;
  }
}

export default DropdownList;