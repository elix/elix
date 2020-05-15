import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars
import {
  defaultState,
  goDown,
  goEnd,
  goFirst,
  goLast,
  goLeft,
  goNext,
  goPrevious,
  goRight,
  goStart,
  goUp,
  state,
  stateEffects,
} from "./internal.js";

/**
 * Maps direction semantics to cursor semantics.
 *
 * This turns a movement in a direction (go left, go right) into a cursor
 * operation (go previous, go next).
 *
 * This mixin can be used in conjunction with
 * [KeyboardDirectionMixin](KeyboardDirectionMixin) (which maps keyboard events
 * to directions) and a mixin that handles cursor operations like
 * [ItemsCursorMixin](ItemsCursorMixin).
 *
 * @module DirectionCursorMixin
 * @param {Constructor<ReactiveElement>} Base
 */
export default function DirectionCursorMixin(Base) {
  // The class prototype added by the mixin.
  class DirectionCursor extends Base {
    get [defaultState]() {
      return Object.assign(super[defaultState] || {}, {
        canGoDown: null,
        canGoLeft: null,
        canGoRight: null,
        canGoUp: null,
      });
    }

    /**
     * Interprets `goDown` to mean "move to the next item".
     */
    [goDown]() {
      if (super[goDown]) {
        super[goDown]();
      }
      return this[goNext]();
    }

    /**
     * Interprets `goEnd` to mean "move to the last item".
     */
    [goEnd]() {
      if (super[goEnd]) {
        super[goEnd]();
      }
      return this[goLast]();
    }

    /**
     * Interprets `goLeft` to mean "move to the previous item".
     *
     * If the element has a `rightToLeft` property and it is true, then this
     * moves to the _next_ item.
     */
    [goLeft]() {
      if (super[goLeft]) {
        super[goLeft]();
      }
      return this[state] && this[state].rightToLeft
        ? this[goNext]()
        : this[goPrevious]();
    }

    /**
     * Interprets `goRight` to mean "move to the next item".
     *
     * If the element has a `rightToLeft` property and it is true, then this
     * moves to the _previous_ item.
     */
    [goRight]() {
      if (super[goRight]) {
        super[goRight]();
      }
      return this[state] && this[state].rightToLeft
        ? this[goPrevious]()
        : this[goNext]();
    }

    /**
     * Interprets `goStart` to mean "move to the first item".
     */
    [goStart]() {
      if (super[goStart]) {
        super[goStart]();
      }
      return this[goFirst]();
    }

    /**
     * Interprets `goUp` to mean "move to the previous item".
     */
    [goUp]() {
      if (super[goUp]) {
        super[goUp]();
      }
      return this[goPrevious]();
    }

    [stateEffects](state, changed) {
      const effects = super[stateEffects]
        ? super[stateEffects](state, changed)
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

  return DirectionCursor;
}
