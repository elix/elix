import defaultScrollTarget from './defaultScrollTarget';
import symbols from './symbols';


/**
 * Mixin which scrolls a container horizontally and/or vertically to ensure that
 * a newly-selected item is visible to the user.
 *
 * When the selected item in a list-like component changes, the selected item
 * should be brought into view so that the user can confirm their selection.
 *
 * This mixin expects a `selectedItem` property to be set when the selection
 * changes. You can supply that yourself, or use
 * [SingleSelectionMixin](SingleSelectionMixin).
 *
 * @module SelectionInViewMixin
 * @param base {Class} - The base class to extend
 * @returns {Class} The extended class
 */
export default (base) => {

  // The class prototype added by the mixin.
  class SelectionInView extends base {

    connectedCallback() {
      if (super.connectedCallback) { super.connectedCallback(); }
      const selectedItem = this.selectedItem;
      if (selectedItem) {
        this.scrollItemIntoView(selectedItem);
      }
    }

    /**
     * Scroll the given element completely into view, minimizing the degree of
     * scrolling performed.
     *
     * Blink has a `scrollIntoViewIfNeeded()` function that does something
     * similar, but unfortunately it's non-standard, and in any event often ends
     * up scrolling more than is absolutely necessary.
     *
     * This scrolls the containing element defined by the `scrollTarget`
     * property. See that property for a discussion of the default value of
     * that property.
     *
     * @param {HTMLElement} item - the item to scroll into view.
     */
    scrollItemIntoView(item) {
      if (super.scrollItemIntoView) { super.scrollItemIntoView(); }

      const scrollTarget = this[symbols.scrollTarget];

      // Determine the bounds of the scroll target and item. We use
      // getBoundingClientRect instead of .offsetTop, etc., because the latter
      // round values, and we want to handle fractional values.
      const scrollTargetRect = scrollTarget.getBoundingClientRect();
      const itemRect = item.getBoundingClientRect();

      // Determine how far the item is outside the viewport.
      const bottomDelta = itemRect.bottom - scrollTargetRect.bottom;
      const topDelta = itemRect.top - scrollTargetRect.top;
      const leftDelta = itemRect.left - scrollTargetRect.left;
      const rightDelta = itemRect.right - scrollTargetRect.right;

      // Scroll the target as necessary to bring the item into view.
      if (bottomDelta > 0) {
        scrollTarget.scrollTop += bottomDelta;            // Scroll down
      } else if (topDelta < 0) {
        scrollTarget.scrollTop += Math.ceil(topDelta);    // Scroll up
      }
      if (rightDelta > 0) {
        scrollTarget.scrollLeft += rightDelta;            // Scroll right
      } else if (leftDelta < 0) {
        scrollTarget.scrollLeft += Math.ceil(leftDelta);  // Scroll left
      }
    }

    /* Provide a default scrollTarget implementation if none exists. */
    get [symbols.scrollTarget]() {
      return super[symbols.scrollTarget] || defaultScrollTarget(this);
    }

    get selectedItem() {
      return super.selectedItem;
    }
    set selectedItem(item) {
      if ('selectedItem' in base.prototype) { super.selectedItem = item; }
      if (item) {
        // Keep the selected item in view.
        this.scrollItemIntoView(item);
      }
    }
  }

  return SelectionInView;
};
