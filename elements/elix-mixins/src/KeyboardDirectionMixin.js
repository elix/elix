import symbols from './symbols';


/**
 * Mixin which maps direction keys (Left, Right, etc.) to direction semantics
 * (go left, go right, etc.).
 *
 * This mixin expects the component to invoke a `keydown` method when a key is
 * pressed. You can use [KeyboardMixin](KeyboardMixin.md) for that
 * purpose, or wire up your own keyboard handling and call `keydown` yourself.
 *
 * This mixin calls methods such as `goLeft` and `goRight`. You can define
 * what that means by implementing those methods yourself. If you want to use
 * direction keys to navigate a selection, use this mixin with
 * [DirectionSelectionMixin](DirectionSelectionMixin.md).
 *
 * If the component defines a property called `symbols.orientation`, the value
 * of that property will constrain navigation to the horizontal or vertical axis.
 *
 * @module KeyboardDirectionMixin
 * @param base {Class} the base class to extend
 * @returns {Class} the extended class
 */
export default function KeyboardDirectionMixin(base) {

  /**
   * The class prototype added by the mixin.
   */
  class KeyboardDirection extends base {

    /**
     * Invoked when the user wants to go/navigate down.
     * The default implementation of this method does nothing.
     */
    [symbols.goDown]() {
      if (super[symbols.goDown]) { return super[symbols.goDown](); }
    }

    /**
     * Invoked when the user wants to go/navigate to the end (e.g., of a list).
     * The default implementation of this method does nothing.
     */
    [symbols.goEnd]() {
      if (super[symbols.goEnd]) { return super[symbols.goEnd](); }
    }

    /**
     * Invoked when the user wants to go/navigate left.
     * The default implementation of this method does nothing.
     */
    [symbols.goLeft]() {
      if (super[symbols.goLeft]) { return super[symbols.goLeft](); }
    }

    /**
     * Invoked when the user wants to go/navigate right.
     * The default implementation of this method does nothing.
     */
    [symbols.goRight]() {
      if (super[symbols.goRight]) { return super[symbols.goRight](); }
    }

    /**
     * Invoked when the user wants to go/navigate to the start (e.g., of a
     * list). The default implementation of this method does nothing.
     */
    [symbols.goStart]() {
      if (super[symbols.goStart]) { return super[symbols.goStart](); }
    }

    /**
     * Invoked when the user wants to go/navigate up.
     * The default implementation of this method does nothing.
     */
    [symbols.goUp]() {
      if (super[symbols.goUp]) { return super[symbols.goUp](); }
    }

    [symbols.keydown](event) {
      let handled = false;

      const orientation = this[symbols.orientation] || 'both';
      const horizontal = (orientation === 'horizontal' || orientation === 'both');
      const vertical = (orientation === 'vertical' || orientation === 'both');

      // Ignore Left/Right keys when metaKey or altKey modifier is also pressed,
      // as the user may be trying to navigate back or forward in the browser.
      switch (event.keyCode) {
        case 35: // End
          handled = this[symbols.goEnd]();
          break;
        case 36: // Home
          handled = this[symbols.goStart]();
          break;
        case 37: // Left
          if (horizontal && !event.metaKey && !event.altKey) {
            handled = this[symbols.goLeft]();
          }
          break;
        case 38: // Up
          if (vertical) {
            handled = event.altKey ? this[symbols.goStart]() : this[symbols.goUp]();
          }
          break;
        case 39: // Right
          if (horizontal && !event.metaKey && !event.altKey) {
            handled = this[symbols.goRight]();
          }
          break;
        case 40: // Down
          if (vertical) {
            handled = event.altKey ? this[symbols.goEnd]() : this[symbols.goDown]();
          }
          break;
      }
      // Prefer mixin result if it's defined, otherwise use base result.
      return handled || (super[symbols.keydown] && super[symbols.keydown](event)) || false;
    }

  }

  return KeyboardDirection;
}
