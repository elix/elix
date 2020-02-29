import { replaceChildNodes } from "../core/dom.js";
import * as internal from "./internal.js";
import ListBox from "./ListBox.js";

/**
 * List that only shows items containing a given text string
 *
 * @inherits ListBox
 */
class FilterListBox extends ListBox {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      filter: null
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
    return this[internal.state].filter;
  }
  set filter(filter) {
    // If external code sets the filter, it's impossible for that code to
    // predict the effects on the items and selection, so we'll need to raise
    // change events.
    const saveRaiseChangesEvents = this[internal.raiseChangeEvents];
    this[internal.raiseChangeEvents] = true;
    this[internal.setState]({ filter });
    this[internal.raiseChangeEvents] = saveRaiseChangesEvents;
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
   * Returns true if the given item should be shown in the indicated state.
   *
   * @param {ListItemElement} item
   * @param {PlainObject} state
   */
  [internal.itemMatchesState](item, state) {
    const base = super[internal.itemMatchesState]
      ? super[internal.itemMatchesState](item, state)
      : true;
    if (!base) {
      return false;
    }
    const text = this[internal.getItemText](item).toLowerCase();
    const filter = state.filter && state.filter.toLowerCase();
    return !filter ? true : !text ? false : text.includes(filter);
  }

  [internal.render](/** @type {PlainObject} */ changed) {
    super[internal.render](changed);
    const { content, filter } = this[internal.state];
    // We inspect `content` instead of `items` so that we can render even those
    // elements that don't match the current filter.
    if ((changed.filter || changed.content) && content) {
      content.forEach(content => {
        if (content instanceof HTMLElement || content instanceof SVGElement) {
          // Hide content elements that don't match the filter.
          const matches = this[internal.itemMatchesState](
            content,
            this[internal.state]
          );
          content.style.display = matches ? "" : "none";

          // For matching items, highlight the matching text.
          if (matches) {
            const childNodes = this.highlightTextInItem(filter, content);
            replaceChildNodes(content, childNodes);
          }
        }
      });
    }
  }

  [internal.stateEffects](state, changed) {
    const effects = super[internal.stateEffects](state, changed);

    // When filter changes, let other mixins know items should be recalculated.
    if (changed.filter) {
      Object.assign(effects, {
        items: null
      });
    }

    return effects;
  }
}

export default FilterListBox;
