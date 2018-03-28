import { merge } from './updates.js';
import * as symbols from './symbols.js';
import deepContains from './deepContains.js';


/**
 * Mixin which maps a click (actually, a mousedown) to an item selection.
 *
 * This simple mixin is useful in list-like elements like [ListBox](ListBox),
 * where a click on a list item implicitly selects it.
 *
 * The standard use for this mixin is in list-like elements. Native list
 * boxes don't appear to be consistent with regard to whether they select
 * on mousedown or click/mouseup. This mixin assumes the use of mousedown.
 * On touch devices, that event appears to trigger when the touch is *released*.
 *
 * This mixin only listens to mousedown events for the primary mouse button
 * (typically the left button). Right-clicks are ignored so that the browser
 * may display a context menu.
 *
 * Much has been written about how to ensure "fast tap" behavior on mobile
 * devices. This mixin makes a very straightforward use of a standard event, and
 * this appears to perform well on mobile devices when, e.g., the viewport is
 * configured with `width=device-width`.
 *
 * This mixin expects the component to provide an `items` property. It also
 * expects the component to define a `state.selectedIndex` member; you can
 * provide that yourself, or use [SingleSelectionMixin](SingleSelectionMixin).
 *
 * If the component receives a clicks that doesn't correspond to an item (e.g.,
 * the user clicks on the element background visible between items), the
 * selection will be removed. However, if the component sets
 * `state.selectionRequired` to true, a background click will *not* remove the
 * selection.
 *
 * @module ClickSelectionMixin
 */
export default function ClickSelectionMixin(Base) {
  
  // The class prototype added by the mixin.
  return class ClickSelection extends Base {

    constructor() {
      // @ts-ignore
      super();
      this.addEventListener('mousedown', event => click(this, event));
    }

    get updates() {
      return merge(super.updates, {
        style: {
          '-moz-user-select': 'none',
          '-ms-user-select': 'none',
          'user-select': 'none'
        }
      });
    }

  };
}


function click(component, event) {

  // Only process events for the main (usually left) button.
  if (event.button !== 0) {
    return;
  }

  component[symbols.raiseChangeEvents] = true;

  // In some situations, the event target will not be the child which was
  // originally clicked on. E.g.,  If the item clicked on is a button, the
  // event seems to be raised in phase 2 (AT_TARGET) — but the event
  // target will be the component, not the item that was clicked on.
  // Instead of using the event target, we get the first node in the
  // event's composed path.
  // @ts-ignore
  const target = event.composedPath ?
    event.composedPath()[0] :
    event.target;

  // Find which item was clicked on and, if found, select it. For elements
  // which don't require a selection, a background click will determine
  // the item was null, in which we case we'll remove the selection.
  const targetIndex = indexOfTarget(component, target);
  const selectionRequired = component.state && component.state.selectionRequired;
  if (targetIndex >= 0 || !selectionRequired) {
    component.selectedIndex = targetIndex;

    // We don't call preventDefault here. The default behavior for
    // mousedown includes setting keyboard focus if the element doesn't
    // already have the focus, and we want to preserve that behavior.
    event.stopPropagation();
  }

  component[symbols.raiseChangeEvents] = false;
}


/**
 * Return the index of the list child that is, or contains, the indicated target
 * node. Return -1 if not found.
 */
function indexOfTarget(element, target) {
  const items = element.items;
  for (let index = 0; index < items.length; index++) {
    const item = items[index];
    if (item === target || deepContains(item, target)) {
      return index;
    }
  }
  return -1;
}
