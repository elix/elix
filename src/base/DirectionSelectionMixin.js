import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars
import * as internal from "./internal.js";

/**
 * Maps direction semantics to cursor semantics.
 *
 * This turns a movement in a direction (go left, go right) into a cursor
 * operation (go previous, go next).
 *
 * This mixin can be used in conjunction with
 * [KeyboardDirectionMixin](KeyboardDirectionMixin) (which maps keyboard events
 * to directions) and a mixin that handles cursor operations like
 * [ItemCursorMixin](ItemCursorMixin).
 *
 * @module DirectionSelectionMixin
 * @param {Constructor<ReactiveElement>} Base
 */
export default function DirectionSelectionMixin(Base) {
  // The class prototype added by the mixin.
  class DirectionSelection extends Base {
    get [internal.defaultState]() {
      return Object.assign(super[internal.defaultState] || {}, {
        canGoDown: null,
        canGoLeft: null,
        canGoRight: null,
        canGoUp: null,
      });
    }

    /**
     * Interprets `goDown` to mean "move to the next item".
     */
    [internal.goDown]() {
      if (super[internal.goDown]) {
        super[internal.goDown]();
      }
      return this[internal.goNext]();
    }

    /**
     * Interprets `goEnd` to mean "move to the last item".
     */
    [internal.goEnd]() {
      if (super[internal.goEnd]) {
        super[internal.goEnd]();
      }
      return this[internal.goLast]();
    }

    /**
     * Interprets `goLeft` to mean "move to the previous item".
     *
     * If the element has a `rightToLeft` property and it is true, then this
     * moves to the _next_ item.
     */
    [internal.goLeft]() {
      if (super[internal.goLeft]) {
        super[internal.goLeft]();
      }
      return this[internal.state] && this[internal.state].rightToLeft
        ? this[internal.goNext]()
        : this[internal.goPrevious]();
    }

    /**
     * Interprets `goRight` to mean "move to the next item".
     *
     * If the element has a `rightToLeft` property and it is true, then this
     * moves to the _previous_ item.
     */
    [internal.goRight]() {
      if (super[internal.goRight]) {
        super[internal.goRight]();
      }
      return this[internal.state] && this[internal.state].rightToLeft
        ? this[internal.goPrevious]()
        : this[internal.goNext]();
    }

    /**
     * Interprets `goStart` to mean "move to the first item".
     */
    [internal.goStart]() {
      if (super[internal.goStart]) {
        super[internal.goStart]();
      }
      return this[internal.goFirst]();
    }

    /**
     * Interprets `goUp` to mean "move to the previous item".
     */
    [internal.goUp]() {
      if (super[internal.goUp]) {
        super[internal.goUp]();
      }
      return this[internal.goPrevious]();
    }

    [internal.stateEffects](state, changed) {
      const effects = super[internal.stateEffects]
        ? super[internal.stateEffects](state, changed)
        : {};

      // Update computed state members to track whether we can go
      // down/left/right/up.
      if (
        changed.canGoNext ||
        changed.canGoPrevious ||
        changed.languageDirection ||
        changed.orientation ||
        changed.rightToLeft
      ) {
        const { canGoNext, canGoPrevious, orientation, rightToLeft } = state;
        const horizontal =
          orientation === "horizontal" || orientation === "both";
        const vertical = orientation === "vertical" || orientation === "both";
        const canGoDown = vertical && canGoNext;
        const canGoLeft = !horizontal
          ? false
          : rightToLeft
          ? canGoNext
          : canGoPrevious;
        const canGoRight = !horizontal
          ? false
          : rightToLeft
          ? canGoPrevious
          : canGoNext;
        const canGoUp = vertical && canGoPrevious;
        Object.assign(effects, {
          canGoDown,
          canGoLeft,
          canGoRight,
          canGoUp,
        });
      }

      return effects;
    }
  }

  return DirectionSelection;
}
