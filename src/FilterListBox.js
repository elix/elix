import { merge } from './updates.js';
import FilterContentItemsMixin from './FilterContentItemsMixin.js';
import ListBox from './ListBox.js';


const Base =
  FilterContentItemsMixin(
    ListBox
  );


class FilterListBox extends Base {

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      trackSelectedItem: false
    });
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

  refineState(state) {
    let result = super.refineState ? super.refineState(state) : true;
    const filterChanged = state.filter !== this.state.filter;
    if (filterChanged && state.selectedIndex > 0) {
      Object.assign(state, {
        selectedIndex: 0
      });
      result = false;
    }
    return result;
  }

}


customElements.define('elix-filter-list-box', FilterListBox);
export default FilterListBox;
