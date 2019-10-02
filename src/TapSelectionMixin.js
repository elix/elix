import { indexOfItemContainingTarget } from './utilities.js';
import * as internal from './internal.js';
import ReactiveElement from './ReactiveElement.js'; // eslint-disable-line no-unused-vars

/**
 * Maps a tap/mousedown on a list item to selection of that item
 *
 * This simple mixin is useful in list-like elements like [ListBox](ListBox),
 * where a tap/mousedown on a list item implicitly selects it.
 *
 * The standard use for this mixin is in list-like elements. Native list
 * boxes don't appear to be consistent with regard to whether they select
 * on mousedown or click/mouseup. This mixin assumes the use of mousedown.
 * On touch devices, that event appears to trigger when the touch is *released*.
 *
 * This mixin only listens to mousedown events for the primary mouse button
 * (typically the left button). Right clicks are ignored so that the browser may
 * display a context menu.
 *
 * This mixin expects the component to provide an `state.items` member. It also
 * expects the component to define a `state.selectedIndex` member; you can
 * provide that yourself, or use [SingleSelectionMixin](SingleSelectionMixin).
 *
 * If the component receives an event that doesn't correspond to an item (e.g.,
 * the user taps on the element background visible between items), the selection
 * will be removed. However, if the component sets `state.selectionRequired` to
 * true, a background tap will *not* remove the selection.
 *
 * @module TapSelectionMixin
 * @param {Constructor<ReactiveElement>} Base
 */
export default function TapSelectionMixin(Base) {
  // The class prototype added by the mixin.
  return class TapSelection extends Base {
    constructor() {
      // @ts-ignore
      super();
      this.addEventListener('mousedown', event => {
        // Only process events for the main (usually left) button.
        if (event.button !== 0) {
          return;
        }
        this[internal.raiseChangeEvents] = true;
        this[internal.tap](event);
        this[internal.raiseChangeEvents] = false;
      });
    }

    [internal.componentDidMount]() {
      if (super[internal.componentDidMount]) {
        super[internal.componentDidMount]();
      }
      Object.assign(this.style, {
        touchAction: 'manipulation', // for iOS Safari
        mozUserSelect: 'none',
        msUserSelect: 'none',
        webkitUserSelect: 'none',
        userSelect: 'none'
      });
    }

    [internal.tap](/** @type {MouseEvent} */ event) {
      // In some situations, the event target will not be the child which was
      // originally clicked on. E.g., if the item clicked on is a button, the
      // event seems to be raised in phase 2 (AT_TARGET) — but the event target
      // will be the component, not the item that was clicked on. Instead of
      // using the event target, we get the first node in the event's composed
      // path.
      // @ts-ignore
      const target = event.composedPath
        ? event.composedPath()[0]
        : event.target;

      // Find which item was clicked on and, if found, select it. For elements
      // which don't require a selection, a background click will determine
      // the item was null, in which we case we'll remove the selection.
      const { items, selectedIndex, selectionRequired } = this[internal.state];
      if (items && target instanceof Node) {
        const targetIndex = indexOfItemContainingTarget(items, target);
        if (
          targetIndex >= 0 ||
          (!selectionRequired && selectedIndex !== targetIndex)
        ) {
          this[internal.setState]({
            selectedIndex: targetIndex
          });
          event.stopPropagation();
        }
      }
    }
  };
}
