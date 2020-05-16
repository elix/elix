import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars
import { rendered, scrollTarget, state } from "./internal.js";
import { defaultScrollTarget } from "./scrolling.js";

/**
 * Scrolls to ensure the current item is visible
 *
 * When the current item in a list-like component changes, the current item
 * should be brought into view so that the user can confirm their selection.
 *
 * This mixin expects an `items` collection, such as that provided by
 * [ContentItemsMixin](ContentItemsMixin). It also expects a
 * `state.currentItem` member indicating which item is current. You
 * can supply that yourself, or use
 * [ItemsCursorMixin](ItemsCursorMixin).
 *
 * @module CurrentItemInViewMixin
 * @param {Constructor<ReactiveElement>} Base
 */
export default function CurrentItemInViewMixin(Base) {
  // The class prototype added by the mixin.
  class CurrentItemInView extends Base {
    [rendered](/** @type {ChangedFlags} */ changed) {
      if (super[rendered]) {
        super[rendered](changed);
      }

      if (changed.currentItem) {
        this.scrollCurrentItemIntoView();
      }
    }

    /**
     * Scroll the current item completely into view, minimizing the degree of
     * scrolling performed.
     *
     * Blink has a `scrollIntoViewIfNeeded()` function that does something
     * similar, but unfortunately it's non-standard, and in any event often ends
     * up scrolling more than is absolutely necessary.
     *
     * This scrolls the containing element defined by the `scrollTarget`
     * property. By default, it will scroll the element itself.
     */
    scrollCurrentItemIntoView() {
      if (super.scrollCurrentItemIntoView) {
        super.scrollCurrentItemIntoView();
      }

      const { currentItem, items } = this[state];
      if (!currentItem || !items) {
        return;
      }

      // Determine the bounds of the scroll target and item. We use
      // getBoundingClientRect instead of .offsetTop, etc., because the latter
      // round values, and we want to handle fractional values.
      const scrollTargetRect = this[scrollTarget].getBoundingClientRect();
      const itemRect = currentItem.getBoundingClientRect();

      // Determine how far the item is outside the viewport.
      const bottomDelta = itemRect.bottom - scrollTargetRect.bottom;
      const leftDelta = itemRect.left - scrollTargetRect.left;
      const rightDelta = itemRect.right - scrollTargetRect.right;
      const topDelta = itemRect.top - scrollTargetRect.top;

      // Scroll the target as necessary to bring the item into view.
      // If an `orientation` state member is defined, only scroll along that
      // axis. Otherwise, assume the orientation is "both".
      const orientation = this[state].orientation || "both";
      if (orientation === "horizontal" || orientation === "both") {
        if (rightDelta > 0) {
          this[scrollTarget].scrollLeft += rightDelta; // Scroll right
        } else if (leftDelta < 0) {
          this[scrollTarget].scrollLeft += Math.ceil(leftDelta); // Scroll left
        }
      }
      if (orientation === "vertical" || orientation === "both") {
        if (bottomDelta > 0) {
          this[scrollTarget].scrollTop += bottomDelta; // Scroll down
        } else if (topDelta < 0) {
          this[scrollTarget].scrollTop += Math.ceil(topDelta); // Scroll up
        }
      }
    }

    /**
     * The element that should be scrolled to get the selected item into view.
     *
     * By default, this uses the [defaultScrollTarget](defaultScrollTarget)
     * helper to find the most likely candidate for scrolling. You can override
     * this property to directly identify which element should be scrolled.
     *
     * See also [scrollTarget](internal#internal.scrollTarget).
     */
    get [scrollTarget]() {
      const base = super[scrollTarget];
      /** @type {any} */
      const element = this;
      return base || defaultScrollTarget(element);
    }
  }

  return CurrentItemInView;
}
