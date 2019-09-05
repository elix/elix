import * as symbols from '../../src/symbols.js';
import ContentItemsMixin from '../../src/ContentItemsMixin.js';
import ReactiveMixin from '../../src/ReactiveMixin.js';
import SingleSelectionMixin from '../../src/SingleSelectionMixin.js';


const Base =
  ContentItemsMixin(
  ReactiveMixin(
  SingleSelectionMixin(
    HTMLElement
  )));


/*
 * A very simple component to show the application of SingleSelectionMixin
 * and ContentItemsMixin.
 *
 * For a more complete demo using SingleSelectionMixin, see the ListBox demo.
 * 
 */
class SingleSelectionDemo extends Base {

  constructor() {
    super();
    /* Clicking an item selects it. */
    this.addEventListener('mousedown', event => {
      if (event.target instanceof Element) {
        this[symbols.raiseChangeEvents] = true;
        this.selectedItem = event.target;
        event.stopPropagation();
        this[symbols.raiseChangeEvents] = false;
      }
    });

    // Simplistic tracking of element children as items.
    // For real applications, use SlotItemsMixin.
    const observer = new MutationObserver(() => {
      this.setState({
        content: [...this.children]
      });
    });
    observer.observe(this, { childList: true });
  }

  get [symbols.defaultState]() {
    return Object.assign(super[symbols.defaultState], {
      content: [...this.children]
    });
  }

  // Map item selection to a `selected` CSS class.
  [symbols.render](/** @type {PlainObject} */ changed) {
    super[symbols.render](changed);
    const { selectedIndex, items } = this.state;
    if (changed.items || changed.selectedIndex && items) {
      // Apply `selected` style to the selected item only.
      items.forEach((item, index) => {
        const selected = index === selectedIndex;
        item.classList.toggle('selected', selected);
      });
    }
  }

}


customElements.define('single-selection-demo', SingleSelectionDemo);
export default SingleSelectionDemo;
