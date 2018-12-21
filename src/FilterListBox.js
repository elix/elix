import { merge } from './updates.js';
import * as symbols from './symbols.js';
import ListBox from './ListBox.js';


/**
 * List that only shows items containing a given text string
 * 
 * @inherits ListBox
 */
class FilterListBox extends ListBox {

  get defaultState() {
    const state = Object.assign(super.defaultState, {
      filter: null
    });

    // When filter changes, let other mixins know items should be recalculated.
    state.onChange('filter', () =>
      ({
        items: null
      })
    );

    return state;
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
    return this.state.filter;
  }
  set filter(filter) {
    // If external code sets the filter, it's impossible for that code to
    // predict the effects on the items and selection, so we'll need to raise
    // change events.
    const saveRaiseChangesEvents = this[symbols.raiseChangeEvents];
    this[symbols.raiseChangeEvents] = true;
    this.setState({ filter });
    this[symbols.raiseChangeEvents] = saveRaiseChangesEvents;
  }

  highlightTextInItem(textToHighlight, item) {
    const text = item.textContent;
    const start = text.toLowerCase().indexOf(textToHighlight);
    if (textToHighlight && start >= 0) {
      const end = start + textToHighlight.length;
      const part1 = text.substr(0, start);
      const part2 = text.substring(start, end);
      const part3 = text.substr(end);
      const fragment = document.createDocumentFragment();
      fragment.appendChild(new Text(part1));
      const strong = document.createElement('strong');
      strong.textContent = part2;
      fragment.appendChild(strong);
      fragment.appendChild(new Text(part3));
      return fragment.childNodes;
    } else {
      return [new Text(text)];
    }
  }

  // An item only matches state if it passes the filter.
  [symbols.itemMatchesState](item, state) {
    const base = super[symbols.itemMatchesState] ?
      super[symbols.itemMatchesState](item, state) :
      true;
    if (!base) {
      return false;
    }
    const text = this[symbols.getItemText](item).toLowerCase();
    const filter = state.filter && state.filter.toLowerCase();
    return !filter ?
      true :
      !text ?
        false :
        text.includes(filter);
  }

  itemUpdates(item, calcs, original) {
    const base = super.itemUpdates ? super.itemUpdates(item, calcs, original) : {};
    const { matches } = calcs;
    const display = matches ? original.style.display : 'none';
    const singleTextNode = item.childNodes.length === 1 &&
      item.childNodes[0] instanceof Text;
    const textToHighlight = matches && this.state.filter ?
      this.state.filter.toLowerCase() :
      null;
    const childNodes = singleTextNode && !matches ?
      null :
      this.highlightTextInItem(textToHighlight, item);
    return merge(base, Object.assign(
      {
        style: {
          display
        }
      },
      childNodes && {
        childNodes
      })
    );
  }

}


customElements.define('elix-filter-list-box', FilterListBox);
export default FilterListBox;
