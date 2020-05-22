import { updateChildNodes } from "../core/dom.js";
import {
  defaultState,
  getItemText,
  itemAvailableInState,
  raiseChangeEvents,
  render,
  setState,
  state,
} from "./internal.js";
import ListBox from "./ListBox.js";

/**
 * List that only shows items containing a given text string
 *
 * @inherits ListBox
 */
class FilterListBox extends ListBox {
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      filter: null,
    });
  }

  /**
   * A text filter applied to the list's items. Only content elements whose
   * text contains the indicated filter text will be included in the list's
   * `items` property. The text search is case insensitive.
   *
   * By default, the filter is empty, so all substantive content elements
   * are included in `items`.
   *
   * @type {string}
   */
  get filter() {
    return this[state].filter;
  }
  set filter(filter) {
    // If external code sets the filter, it's impossible for that code to
    // predict the effects on the items and selection, so we'll need to raise
    // change events.
    const saveRaiseChangesEvents = this[raiseChangeEvents];
    this[raiseChangeEvents] = true;
    this[setState]({ filter });
    this[raiseChangeEvents] = saveRaiseChangesEvents;
  }

  /**
   * @private
   * @param {string} textToHighlight
   * @param {ListItemElement} item
   */
  highlightTextInItem(textToHighlight, item) {
    const text = item.textContent || "";
    const start = textToHighlight
      ? text.toLowerCase().indexOf(textToHighlight.toLowerCase())
      : -1;
    if (start >= 0) {
      const end = start + textToHighlight.length;
      const part1 = text.substr(0, start);
      const part2 = text.substring(start, end);
      const part3 = text.substr(end);
      const fragment = document.createDocumentFragment();
      const strong = document.createElement("strong");
      strong.textContent = part2;
      fragment.append(new Text(part1), strong, new Text(part3));
      return fragment.childNodes;
    } else {
      return [new Text(text)];
    }
  }

  /**
   * Returns true if the given item is available (matches the filter) in the
   * given state.
   *
   * @param {ListItemElement} item
   * @param {PlainObject} state
   */
  [itemAvailableInState](item, state) {
    const base = super[itemAvailableInState]
      ? super[itemAvailableInState](item, state)
      : true;
    if (!base) {
      return false;
    }
    const text = this[getItemText](item).toLowerCase();
    const filter = state.filter && state.filter.toLowerCase();
    return !filter ? true : !text ? false : text.includes(filter);
  }

  [render](/** @type {ChangedFlags} */ changed) {
    super[render](changed);

    // Hide items that don't match state.
    // For matching items, highlight the matching text.
    if (changed.filter || changed.items) {
      const { filter, items } = this[state];
      if (items) {
        items.forEach((item) => {
          const matches = this[itemAvailableInState](item, this[state]);
          item.style.display = matches ? "" : "none";
          if (matches) {
            const childNodes = this.highlightTextInItem(filter, item);
            updateChildNodes(item, childNodes);
          }
        });
      }
    }
  }
}

export default FilterListBox;
