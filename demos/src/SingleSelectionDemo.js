import * as internal from '../../src/internal.js';
import ContentItemsMixin from '../../src/ContentItemsMixin.js';
import ReactiveMixin from '../../src/ReactiveMixin.js';
import SingleSelectionMixin from '../../src/SingleSelectionMixin.js';

const Base = ContentItemsMixin(
  ReactiveMixin(SingleSelectionMixin(HTMLElement))
);

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
        this[internal.raiseChangeEvents] = true;
        this.selectedItem = event.target;
        event.stopPropagation();
        this[internal.raiseChangeEvents] = false;
      }
    });

    // Simplistic tracking of element children as items.
    // For real applications, use SlotItemsMixin.
    const observer = new MutationObserver(() => {
      this[internal.setState]({
        content: [...this.children]
      });
    });
    observer.observe(this, { childList: true });
  }

  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      content: [...this.children]
    });
  }

  // Map item selection to a `selected` CSS class.
  [internal.render](/** @type {PlainObject} */ changed) {
    super[internal.render](changed);
    const { selectedIndex, items } = this[internal.state];
    if (changed.items || (changed.selectedIndex && items)) {
      // Apply a `selected` attribute to the selected item only.
      items.forEach((item, index) => {
        item.toggleAttribute('selected', index === selectedIndex);
      });
    }
  }
}

customElements.define('single-selection-demo', SingleSelectionDemo);
export default SingleSelectionDemo;
