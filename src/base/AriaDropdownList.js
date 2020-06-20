import { updateChildNodes } from "../core/dom.js";
import { fragmentFrom } from "../core/htmlLiterals.js";
import DropdownList from "./DropdownList.js";
import {
  defaultState,
  firstRender,
  ids,
  render,
  rendered,
  setState,
  state,
  stateEffects,
  template,
} from "./internal.js";
import ListBox from "./ListBox.js";

class AriaDropdownList extends DropdownList {
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      accessibleItems: null,
      menuPartType: ListBox,
    });
  }

  [render](changed) {
    super[render](changed);

    if (changed.items || changed.selectedIndex) {
      // Override AriaListMixin
      this.removeAttribute("aria-activedescendant");
    }
  }

  [rendered](changed) {
    super[rendered](changed);

    if (this[firstRender]) {
      // Pick up content from list.
      const content = this[ids].menu.children;
      this[setState]({ content });
    }

    if (changed.accessibleItems) {
      const { accessibleItems } = this[state];
      updateChildNodes(this[ids].menu, accessibleItems);
    }
  }

  [stateEffects](state, changed) {
    const effects = super[stateEffects](state, changed);

    if (changed.items) {
      // Create accessible items for dropdown list.
      const items = state.items || [];
      const accessibleItems = items.map((item) => {
        const option = document.createElement("option");
        option.textContent = item.textContent; // TODO getItemText
        return option;
      });
      Object.assign(effects, { accessibleItems });
    }

    return effects;
  }

  get [template]() {
    const result = super[template];

    // Connect the source to the list.
    const source = result.content.querySelector('[part~="source"]');
    if (source) {
      source.setAttribute("aria-activedescendant", "value");
      source.setAttribute("aria-autocomplete", "none");
      source.setAttribute("aria-controls", "menu");
      source.setAttribute("aria-label", "Fruit");
      source.role = "combobox";
    }

    // Remove default slot from inside menu.
    const defaultSlot = result.content.querySelector("slot:not([name])");
    if (defaultSlot) {
      defaultSlot.remove();
    }

    // Create new default slot inside hidden container.
    result.content.append(fragmentFrom.html`
      <style>
        #hiddenContainer {
          display: none;
        }
      </style>
      <div id="hiddenContainer">
        <slot></slot>
      </div>
    `);

    return result;
  }
}

export default AriaDropdownList;
