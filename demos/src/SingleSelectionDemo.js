import ContentItemsMixin from "../../src/base/ContentItemsMixin.js";
import * as internal from "../../src/base/internal.js";
import ItemsCursorMixin from "../../src/base/ItemsCursorMixin.js";
import ReactiveMixin from "../../src/core/ReactiveMixin.js";

const Base = ContentItemsMixin(ItemsCursorMixin(ReactiveMixin(HTMLElement)));

/*
 * A very simple component to show the application of ItemsCursorMixin and
 * ContentItemsMixin to support single selection.
 *
 * For a complete list box implementation, see the ListBox component.
 *
 */
class SingleSelectionDemo extends Base {
  constructor() {
    super();
    /* Clicking an item selects it. */
    this.addEventListener("mousedown", (event) => {
      if (event.target instanceof Element) {
        this[internal.raiseChangeEvents] = true;
        const item = event.target;
        const currentIndex = this[internal.state].content.indexOf(item);
        this[internal.setState]({ currentIndex });
        event.stopPropagation();
        this[internal.raiseChangeEvents] = false;
      }
    });

    // Simplistic tracking of element children as items.
    // For real applications, use SlotItemsMixin.
    const observer = new MutationObserver(() => {
      this[internal.setState]({
        content: [...this.children],
      });
    });
    observer.observe(this, { childList: true });
  }

  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      content: [...this.children],
    });
  }

  // Map item selection to a `selected` CSS class.
  [internal.render](/** @type {PlainObject} */ changed) {
    super[internal.render](changed);

    // Apply a `selected` attribute to the selected item only.
    const { currentIndex, items } = this[internal.state];
    if (changed.items || (changed.currentIndex && items)) {
      items.forEach((item, index) => {
        item.toggleAttribute("selected", index === currentIndex);
      });
    }
  }
}

customElements.define("single-selection-demo", SingleSelectionDemo);
export default SingleSelectionDemo;
