import { defaultScrollTarget } from './scrolling.js';
import * as internal from './internal.js';
import ReactiveElement from './ReactiveElement.js'; // eslint-disable-line no-unused-vars

/**
 * Maps the Page Up and Page Down keys to selection operations.
 *
 * The keyboard interaction model generally follows that of Microsoft Windows'
 * list boxes instead of those in OS X:
 *
 * * The Page Up/Down and Home/End keys actually change the selection, rather
 *   than just scrolling. The former behavior seems more generally useful for
 *   keyboard users.
 *
 * * Pressing Page Up/Down will change the selection to the topmost/bottommost
 *   visible item if the selection is not already there. Thereafter, the key
 *   will move the selection up/down by a page, and (per the above point) make
 *   the selected item visible.
 *
 * To ensure the selected item is in view following use of Page Up/Down, use
 * the related [SelectionInViewMixin](SelectionInViewMixin).
 *
 * This mixin expects the component to provide:
 *
 * * A `[internal.keydown]` method invoked when a key is pressed. You can use
 *   [KeyboardMixin](KeyboardMixin) for that purpose, or wire up your own
 *   keyboard handling and call `[internal.keydown]` yourself.
 * * A `selectedIndex` state member updatable via [internal.setState]`.
 *
 * @module KeyboardPagedSelectionMixin
 * @param {Constructor<ReactiveElement>} Base
 */
export default function KeyboardPagedSelectionMixin(Base) {
  // The class prototype added by the mixin.
  class KeyboardPagedSelection extends Base {
    [internal.keydown](/** @type {KeyboardEvent} */ event) {
      let handled = false;
      const orientation = this.orientation;
      if (orientation !== 'horizontal') {
        switch (event.key) {
          case 'PageDown':
            handled = this.pageDown();
            break;

          case 'PageUp':
            handled = this.pageUp();
            break;
        }
      }

      // Prefer mixin result if it's defined, otherwise use base result.
      return (
        handled || (super[internal.keydown] && super[internal.keydown](event))
      );
    }

    // Default orientation implementation defers to super,
    // but if not found, looks in state.
    get orientation() {
      return (
        super.orientation ||
        (this[internal.state] && this[internal.state].orientation) ||
        'both'
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
     * See [internal.scrollTarget](symbols#scrollTarget).
     *
     * @type {HTMLElement}
     */
    get [internal.scrollTarget]() {
      /** @type {any} */
      const element = this;
      return super[internal.scrollTarget] || defaultScrollTarget(element);
    }
  }

  return KeyboardPagedSelection;
}

/**
 * Return the item whose content spans the given y position (relative to the
 * top of the list's scrolling client area), or null if not found.
 *
 * If downward is true, move down the list of items to find the first item
 * found at the given y position; if downward is false, move up the list of
 *
 * items to find the last item at that position.
 *
 * @private
 * @param {ListItemElement[]} items
 * @param {number} y
 * @param {boolean} downward
 */
function getIndexOfItemAtY(items, y, downward) {
  const start = downward ? 0 : items.length - 1;
  const end = downward ? items.length : 0;
  const step = downward ? 1 : -1;

  // Find the item spanning the indicated y coordinate.
  let index;
  /** @type {HTMLElement|SVGElement|null} */ let item = null;
  let itemRect;
  for (index = start; index !== end; index += step) {
    itemRect = items[index].getBoundingClientRect();
    if (itemRect.top <= y && y <= itemRect.bottom) {
      // Item spans the indicated y coordinate.
      item = items[index];
      break;
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
 * Return true if we ended up changing the selection, false if not.
 *
 * @private
 * @param {ReactiveElement} element
 * @param {boolean} downward
 */
function scrollOnePage(element, downward) {
  const scrollTarget = element[internal.scrollTarget];
  const items = element[internal.state].items;
  const selectedIndex = element[internal.state].selectedIndex;

  // Determine the item visible just at the edge of direction we're heading.
  // We'll select that item if it's not already selected.
  const targetRect = scrollTarget.getBoundingClientRect();
  const edge = downward ? targetRect.bottom : targetRect.top;
  const indexOfItemAtEdge = getIndexOfItemAtY(items, edge, downward);

  let newIndex;
  if (indexOfItemAtEdge && selectedIndex === indexOfItemAtEdge) {
    // The item at the edge was already selected, so scroll in the indicated
    // direction by one page, measuring from the bounds of the currently
    // selected item. Leave the new item at that edge selected.
    const selectedItem = items[selectedIndex];
    const selectedRect = selectedItem.getBoundingClientRect();
    const pageHeight = scrollTarget.clientHeight;
    const y = downward
      ? selectedRect.bottom + pageHeight
      : selectedRect.top - pageHeight;
    newIndex = getIndexOfItemAtY(items, y, downward);
  } else {
    // The item at the edge wasn't selected yet. Instead of scrolling, we'll
    // just select that item. That is, the first attempt to page up/down
    // usually just moves the selection to the edge in that direction.
    newIndex = indexOfItemAtEdge;
  }

  if (!newIndex) {
    // We can't find an item in the direction we want to travel. Select the
    // last item (if moving downward) or first item (if moving upward).
    newIndex = downward ? items.length - 1 : 0;
  }

  // If external code causes an operation that scrolls the page, it's impossible
  // for it to predict where the selectedIndex is going to end up. Accordingly,
  // we raise change events.
  const saveRaiseChangesEvents = element[internal.raiseChangeEvents];
  element[internal.raiseChangeEvents] = true;

  element[internal.setState]({
    selectedIndex: newIndex
  });

  element[internal.raiseChangeEvents] = saveRaiseChangesEvents;

  const changed = element[internal.state].selectedIndex !== selectedIndex;
  return changed;
}
