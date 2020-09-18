import { updateChildNodes } from "../core/dom.js";
import {
  defaultState,
  getItemText,
  raiseChangeEvents,
  render,
  rendered,
  setState,
  state,
  stateEffects,
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
      availableItemFlags: null,
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
    this[setState]({
      filter: String(filter),
    });
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
      ? normalize(text).indexOf(normalize(textToHighlight))
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
   * @param {string} filter
   * @returns {boolean}
   */
  itemMatchesFilter(item, filter) {
    const text = this[getItemText](item);
    if (!filter) {
      return true;
    } else if (!text) {
      return false;
    } else {
      const normalizedText = normalize(text);
      const normalizedFilter = normalize(filter);
      return normalizedText.includes(normalizedFilter);
    }
  }

  [render](/** @type {ChangedFlags} */ changed) {
    super[render](changed);

    // Hide items that don't match state.
    // For matching items, highlight the matching text.
    if (changed.filter || changed.items) {
      const { filter, availableItemFlags, items } = this[state];
      if (items) {
        items.forEach((item, index) => {
          const available = availableItemFlags[index];
          item.style.display = available ? "" : "none";
          if (available) {
            const childNodes = this.highlightTextInItem(filter, item);
            updateChildNodes(item, childNodes);
          }
        });
      }
    }
  }

  [rendered](changed) {
    super[rendered](changed);

    // If filter changed, we may need to scroll cursor back into view.
    if (changed.filter) {
      this.scrollCurrentItemIntoView();
    }
  }

  [stateEffects](state, changed) {
    const effects = super[stateEffects]
      ? super[stateEffects](state, changed)
      : {};

    if (changed.filter || changed.items) {
      const { filter, items } = state;
      const availableItemFlags =
        items === null
          ? null
          : items.map((item) => this.itemMatchesFilter(item, filter));
      Object.assign(effects, { availableItemFlags });
    }

    return effects;
  }
}

// Normalize the given string for searching.
//
// The Intl.Collator object has the options we want, and even has a tempting
// "search" usage defined for it, but as of May 2020, the only use of that
// object seems to be comparing strings instead of searching. So for now
// this may be the best we can do.
function normalize(s) {
  return removeAccents(s).toLowerCase();
}

// Replace accented characters with unaccented counterparts.
// From https://www.datatables.net/plug-ins/filtering/type-based/accent-neutralise.
//
// Note: this may be good enough for our purposes, but is not strictly
// correct, as accents can be significant in some languages and not in others.
// Example: ä and a have the same base letter in German, but in Swedish
// those are separate base letters.
function removeAccents(s) {
  // Decompose the string into the Unicode NFD (Canonical Decomposition) to
  // separate base characters from their accent characters, then strips out the
  // accent characters.
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export default FilterListBox;
