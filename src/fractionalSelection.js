/**
 * Helpers for rendering transitions between selection states
 *
 * These functions help a component work with "fractional selection". This
 * notion can be very helpful in modeling components such as carousels (e.g.,
 * [Carousel](Carousel), in which the selection state during user
 * interaction may be partway between one item and the next. With fractional
 * selection, we add a real number between 0 and 1 to a selected index to obtain
 * a fractional selection value.
 *
 * Consider a carousel displaying a set of images. Suppose the image at index 3
 * is selected. The carousel's `selectedIndex` state at this point is 3. The
 * user begins dragging the carousel with their finger. Image 3 moves out of
 * view, and the image 4 moves into view. When the user is halfway through this
 * operation, we might say that the fractional selection value is 3.5.
 * Eventually, the user releases their finger, and the carousel shows the image
 * 4 selected; the `selectedIndex` is 4.
 *
 * These functions help components work consistently with fractional selection.
 *
 * @module fractionalSelection
 */

/**
 * Dampen a selection that goes past the beginning or end of a list. This is
 * generally used to produce a visual effect of tension as the user tries to
 * go further in a direction that has no more items.
 *
 * Example: suppose `itemCount` is 5, indicating a list of 5 items. The index of
 * the last item is 4. If the `selection` parameter is 4.5, the user is trying
 * to go past this last item. When a damping function is applied, the resulting
 * value will be less than 4.5 (the actual value will be 4.25). When this
 * selection state is rendered, the user will see that, each unit distance the
 * drag travels has less and less visible effect. This is perceived as tension.
 *
 * @param {number} selection - A real number indicating a selection position
 * @param {number} itemCount - An integer for the number of items in the list
 * @returns {number} A real number representing the damped selection value.
 */
export function dampenListSelection(selection, itemCount) {
  const bound = itemCount - 1;
  let damped;
  if (selection < 0) {
    // Trying to go past beginning of list. Apply tension from the left edge.
    damped = -dampen(-selection);
  } else if (selection >= bound) {
    // Trying to go past end of list. Apply tension from the right edge.
    damped = bound + dampen(selection - bound);
  } else {
    // No damping required.
    damped = selection;
  }
  return damped;
}

/**
 * Calculate damping as a function of the distance past the minimum/maximum
 * values.
 *
 * We want to asymptotically approach an absolute minimum of 1 unit
 * below/above the actual minimum/maximum. This requires calculating a
 * hyperbolic function.
 *
 * We use the formula `y = (-1/(x+1))+1`.
 * (See a [graph of this
 * function](http://www.wolframalpha.com/input/?i=y%3D(-1%2F(x%2B1))%2B1).)
 * The only portion of that function we care about is when x is zero or greater.
 * An important consideration is that the curve be tangent to the diagonal line
 * x=y at (0, 0). This ensures smooth continuity with the normal drag behavior,
 * in which the visible sliding is linear with the distance the touchpoint has
 * been dragged.
 *
 * @param {number} x - The number of dampen
 * @returns {number}
 */
export function dampen(x) {
  const y = -1 / (x + 1) + 1;
  return y;
}
