import { fragmentFrom } from "../core/htmlLiterals.js";
import DropdownList from "./DropdownList.js";
import {
  defaultState,
  firstRender,
  ids,
  render,
  rendered,
  setState,
  template,
} from "./internal.js";
import ListBox from "./ListBox.js";

class AriaDropdownList extends DropdownList {
  get [defaultState]() {
    return Object.assign(super[defaultState], {
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

    // Replace default slot with hard-coded list items.
    const defaultSlot = result.content.querySelector("slot:not([name])");
    if (defaultSlot) {
      defaultSlot.replaceWith(fragmentFrom.html`
        <elix-option value="apple">Apple</elix-option>
        <elix-option value="banana">Banana</elix-option>
        <elix-option value="blueberry">Blueberry</elix-option>
        <elix-option value="boysenberry">Boysenberry</elix-option>
        <elix-option value="cherry">Cherry</elix-option>
        <elix-option value="durian">Durian</elix-option>
        <elix-option value="eggplant">Eggplant</elix-option>
        <elix-option value="fig">Fig</elix-option>
        <elix-option value="grape">Grape</elix-option>
        <elix-option value="guava">Guava</elix-option>
        <elix-option value="huckleberry">Huckleberry</elix-option>
      `);
    }

    return result;
  }
}

export default AriaDropdownList;
