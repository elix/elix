import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars
import {
  itemMatchesState,
  keydown,
  raiseChangeEvents,
  scrollTarget,
  setState,
  state,
} from "./internal.js";
import { defaultScrollTarget } from "./scrolling.js";

/**
 * Maps the Page Up and Page Down keys to item cursor operations.
 *
 * The keyboard interaction model generally follows that of Microsoft Windows'
 * list boxes instead of those in OS X:
 *
 * * The Page Up/Down and Home/End keys actually move the item cursor, rather
 *   than just scrolling. The former behavior seems more generally useful for
 *   keyboard users.
 *
 * * Pressing Page Up/Down will first move the cursor to the topmost/bottommost
 *   visible item if the cursor is not already there. Thereafter, the key
 *   will move the cursor up/down by a page, and (per the above point) make
 *   the current item visible.
 *
 * To ensure the current item is in view following use of Page Up/Down, use
 * the related [CurrentItemInViewMixin](CurrentItemInViewMixin).
 *
 * This mixin expects the component to provide:
 *
 * * A `[keydown]` method invoked when a key is pressed. You can use
 *   [KeyboardMixin](KeyboardMixin) for that purpose, or wire up your own
 *   keyboard handling and call `[keydown]` yourself.
 * * A `currentIndex` state member updatable via [setState]`.
 *
 * @module KeyboardPagedCursorMixin
 * @param {Constructor<ReactiveElement>} Base
 */
export default function KeyboardPagedCursorMixin(Base) {
  // The class prototype added by the mixin.
  class KeyboardPagedCursor extends Base {
    [keydown](/** @type {KeyboardEvent} */ event) {
      let handled = false;
      const orientation = this.orientation;
      if (orientation !== "horizontal") {
        switch (event.key) {
          case "PageDown":
            handled = this.pageDown();
            break;

          case "PageUp":
            handled = this.pageUp();
            break;
        }
      }

      // Prefer mixin result if it's defined, otherwise use base result.
      return handled || (super[keydown] && super[keydown](event));
    }

    // Default orientation implementation defers to super,
    // but if not found, looks in state.
    get orientation() {
      return (
        super.orientation || (this[state] && this[state].orientation) || "both"
      );
    }

    /**
     * Scroll down one page.
     */
    pageDown() {
      if (super.pageDown) {
        super.pageDown();
      }
      return scrollOnePage(this, true);
    }

    /**
     * Scroll up one page.
     */
    pageUp() {
      if (super.pageUp) {
        super.pageUp();
      }
      return scrollOnePage(this, false);
    }

    /**
     * The element that will be scrolled when the user presses Page Up or
     * Page Down. The default value is calculated by
     * [defaultScrollTarget](defaultScrollTarget#defaultScrollTarget).
     *
     * See [scrollTarget](internal#internal.scrollTarget).
     *
     * @type {HTMLElement}
     */
    get [scrollTarget]() {
      /** @type {any} */
      const element = this;
      return super[scrollTarget] || defaultScrollTarget(element);
    }
  }

  return KeyboardPagedCursor;
}

/**
 * Return the item whose content spans the given y position (relative to the
 * top of the list's scrolling client area), or null if not found.
 *
 * If downward is true, move down the list of items to find the first item
 * found at the given y position; if downward is false, move up the list of
 * items to find the last item at that position.
 *
 * @private
 * @param {ReactiveElement} element
 * @param {number} y
 * @param {boolean} downward
 */
function getIndexOfItemAtY(element, y, downward) {
  const items = element[state].items;
  const start = downward ? 0 : items.length - 1;
  const end = downward ? items.length : 0;
  const step = downward ? 1 : -1;

  // Find the item spanning the indicated y coordinate.
  let index;
  /** @type {HTMLElement|SVGElement|null} */ let item = null;
  let itemRect;
  for (index = start; index !== end; index += step) {
    // Only consider items that match the element's current state.
    const matches = element[itemMatchesState]
      ? element[itemMatchesState](items[index], element[state])
      : true;
    if (matches) {
      itemRect = items[index].getBoundingClientRect();
      if (itemRect.top <= y && y <= itemRect.bottom) {
        // Item spans the indicated y coordinate.
        item = items[index];
        break;
      }
    }
  }

  if (!item || !itemRect) {
    return null;
  }

  // We may have found an item whose padding spans the given y coordinate,
  // but whose content is actually above/below that point.
  // TODO: If the item has a border, then padding should be included in
  // considering a hit.
  const itemStyle = getComputedStyle(item);
  const itemPaddingTop = itemStyle.paddingTop
    ? parseFloat(itemStyle.paddingTop)
    : 0;
  const itemPaddingBottom = itemStyle.paddingBottom
    ? parseFloat(itemStyle.paddingBottom)
    : 0;
  const contentTop = itemRect.top + itemPaddingTop;
  const contentBottom =
    contentTop + item.clientHeight - itemPaddingTop - itemPaddingBottom;
  if ((downward && contentTop <= y) || (!downward && contentBottom >= y)) {
    // The indicated coordinate hits the actual item content.
    return index;
  } else {
    // The indicated coordinate falls within the item's padding. Back up to
    // the item below/above the item we found and return that.
    return index - step;
  }
}

/**
 * Move by one page downward (if downward is true), or upward (if false).
 * Return true if we ended up moving the cursor, false if not.
 *
 * @private
 * @param {ReactiveElement} element
 * @param {boolean} downward
 */
function scrollOnePage(element, downward) {
  const items = element[state].items;
  const currentIndex = element[state].currentIndex;

  // Determine the item visible just at the edge of direction we're heading.
  // We'll move to that item if it's not already current.
  const targetRect = element[scrollTarget].getBoundingClientRect();
  const edge = downward ? targetRect.bottom : targetRect.top;
  const indexOfItemAtEdge = getIndexOfItemAtY(element, edge, downward);

  let newIndex;
  if (indexOfItemAtEdge && currentIndex === indexOfItemAtEdge) {
    // The item at the edge was already current, so scroll in the indicated
    // direction by one page, measuring from the bounds of the current item.
    // Leave the new item at that edge current.
    const currentItem = items[currentIndex];
    const currentRect = currentItem.getBoundingClientRect();
    const pageHeight = element[scrollTarget].clientHeight;
    const y = downward
      ? currentRect.bottom + pageHeight
      : currentRect.top - pageHeight;
    newIndex = getIndexOfItemAtY(element, y, downward);
  } else {
    // The item at the edge wasn't current yet. Instead of scrolling, we'll just
    // move to that item. That is, the first attempt to page up/down usually
    // just moves the cursor to the edge in that direction.
    newIndex = indexOfItemAtEdge;
  }

  if (!newIndex) {
    // We went past the first/last item without finding an item. Move to the
    // last item (if moving downward) or first item (if moving upward).
    // newIndex = downward ? items.length - 1 : 0;
    const start = -1;
    const direction = downward ? -1 /* Work up */ : 1; /* Work down */
    newIndex = element.closestItemMatchingState(
      element[state],
      start,
      direction
    );
  }

  // If external code causes an operation that scrolls the page, it's impossible
  // for it to predict where the currentIndex is going to end up. Accordingly,
  // we raise change events.
  const saveRaiseChangesEvents = element[raiseChangeEvents];
  element[raiseChangeEvents] = true;

  element[setState]({
    currentIndex: newIndex,
  });

  element[raiseChangeEvents] = saveRaiseChangesEvents;

  const changed = element[state].currentIndex !== currentIndex;
  return changed;
}
