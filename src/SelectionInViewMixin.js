import { defaultScrollTarget } from './scrolling.js';
import * as symbols from './symbols.js';


/**
 * Scrolls to ensure the selected item is visible
 *
 * When the selected item in a list-like component changes, the selected item
 * should be brought into view so that the user can confirm their selection.
 *
 * This mixin expects an `items` collection, such as that provided by
 * [ContentItemsMixin](ContentItemsMixin). It also expects a
 * `state.selectedIndex` member indicating which item is curently selected. You
 * can supply that yourself, or use
 * [SingleSelectionMixin](SingleSelectionMixin).
 *
 * @module SelectionInViewMixin
 */
export default function SelectionInViewMixin(Base) {

  // The class prototype added by the mixin.
  class SelectionInView extends Base {

    componentDidMount() {
      if (super.componentDidMount) { super.componentDidMount(); }
      this.scrollSelectionIntoView();
    }

    componentDidUpdate(changed) {
      if (super.componentDidUpdate) { super.componentDidUpdate(changed); }
      this.scrollSelectionIntoView();
    }

    /**
     * Scroll the selected item element completely into view, minimizing the
     * degree of scrolling performed.
     *
     * Blink has a `scrollIntoViewIfNeeded()` function that does something
     * similar, but unfortunately it's non-standard, and in any event often ends
     * up scrolling more than is absolutely necessary.
     *
     * This scrolls the containing element defined by the `scrollTarget`
     * property. By default, it will scroll the element itself.
     */
    scrollSelectionIntoView() {
      if (super.scrollSelectionIntoView) { super.scrollSelectionIntoView(); }

      const scrollTarget = this[symbols.scrollTarget];
      const { selectedIndex, items } = this.state;
      if (selectedIndex < 0 || !items) {
        return;
      }
      
      const selectedItem = items[selectedIndex];
      if (!selectedItem) {
        return;
      }

      // Determine the bounds of the scroll target and item. We use
      // getBoundingClientRect instead of .offsetTop, etc., because the latter
      // round values, and we want to handle fractional values.
      const scrollTargetRect = scrollTarget.getBoundingClientRect();
      const itemRect = selectedItem.getBoundingClientRect();

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

    
    /**
     * The element that should be scrolled to get the selected item into view.
     * 
     * By default, this uses the [defaultScrollTarget](defaultScrollTarget)
     * helper to find the most likely candidate for scrolling. You can override
     * this property to directly identify which element should be scrolled.
     * 
     * See also [symbols.scrollTarget](symbols#scrollTarget).
     */
    get [symbols.scrollTarget]() {
      const base = super[symbols.scrollTarget];
      /** @type {any} */
      const element = this;
      return base || defaultScrollTarget(element);
    }
  }

  return SelectionInView;
}
