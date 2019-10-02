import * as internal from './internal.js';
import ReactiveElement from './ReactiveElement.js'; // eslint-disable-line no-unused-vars

/**
 * Maps direction semantics to selection semantics.
 *
 * This turns a movement in a direction (go left, go right) into a change in
 * selection (select previous, select next).
 *
 * This mixin can be used in conjunction with
 * [KeyboardDirectionMixin](KeyboardDirectionMixin) (which maps keyboard
 * events to directions) and a mixin that handles selection like
 * [SingleSelectionMixin](SingleSelectionMixin).
 *
 * @module DirectionSelectionMixin
 * @param {Constructor<ReactiveElement>} Base
 */
export default function DirectionSelectionMixin(Base) {
  // The class prototype added by the mixin.
  class DirectionSelection extends Base {
    get [internal.defaultState]() {
      const state = Object.assign(super[internal.defaultState], {
        canGoDown: null,
        canGoLeft: null,
        canGoRight: null,
        canGoUp: null
      });

      // Update computed state members to track whether we can go
      // down/left/right/up.
      state.onChange(
        [
          'canSelectNext',
          'canSelectPrevious',
          'languageDirection',
          'orientation',
          'rightToLeft'
        ],
        state => {
          const {
            canSelectNext,
            canSelectPrevious,
            orientation,
            rightToLeft
          } = state;
          const canGoNext = canSelectNext;
          const canGoPrevious = canSelectPrevious;
          const horizontal =
            orientation === 'horizontal' || orientation === 'both';
          const vertical = orientation === 'vertical' || orientation === 'both';
          const canGoDown = vertical && canSelectNext;
          const canGoLeft = !horizontal
            ? false
            : rightToLeft
            ? canSelectNext
            : canSelectPrevious;
          const canGoRight = !horizontal
            ? false
            : rightToLeft
            ? canSelectPrevious
            : canSelectNext;
          const canGoUp = vertical && canSelectPrevious;
          return {
            canGoDown,
            canGoLeft,
            canGoNext,
            canGoPrevious,
            canGoRight,
            canGoUp
          };
        }
      );

      return state;
    }

    /**
     * Invokes `selectNext` to select the next item.
     */
    [internal.goDown]() {
      if (super[internal.goDown]) {
        super[internal.goDown]();
      }
      if (!this.selectNext) {
        /* eslint-disable no-console */
        console.warn(
          `DirectionSelectionMixin expects ${this.constructor.name} to define a "selectNext" method.`
        );
        return false;
      } else {
        return this.selectNext();
      }
    }

    /**
     * Invokes `selectLast` to select the next item.
     */
    [internal.goEnd]() {
      if (super[internal.goEnd]) {
        super[internal.goEnd]();
      }
      if (!this.selectLast) {
        /* eslint-disable no-console */
        console.warn(
          `DirectionSelectionMixin expects ${this.constructor.name} to define a "selectLast" method.`
        );
        return false;
      } else {
        return this.selectLast();
      }
    }

    /**
     * Invokes `selectPrevious` to select the previous item.
     *
     * If the element has a `rightToLeft` property and it is true, then this
     * selects the _next_ item.
     */
    [internal.goLeft]() {
      if (super[internal.goLeft]) {
        super[internal.goLeft]();
      }
      if (!this.selectPrevious) {
        /* eslint-disable no-console */
        console.warn(
          `DirectionSelectionMixin expects ${this.constructor.name} to define a "selectPrevious" method.`
        );
        return false;
      } else {
        return this[internal.state] && this[internal.state].rightToLeft
          ? this.selectNext()
          : this.selectPrevious();
      }
    }

    /**
     * Invokes `selectNext` to select the next item.
     */
    [internal.goNext]() {
      if (super[internal.goNext]) {
        super[internal.goNext]();
      }
      return this.selectNext();
    }

    /**
     * Invokes `selectPrevious` to select the previous item.
     */
    [internal.goPrevious]() {
      if (super[internal.goPrevious]) {
        super[internal.goPrevious]();
      }
      return this.selectPrevious();
    }

    /**
     * Invokes `selectNext` to select the next item.
     *
     * If the element has a `rightToLeft` property and it is true, then this
     * selects the _previous_ item.
     */
    [internal.goRight]() {
      if (super[internal.goRight]) {
        super[internal.goRight]();
      }
      if (!this.selectNext) {
        /* eslint-disable no-console */
        console.warn(
          `DirectionSelectionMixin expects ${this.constructor.name} to define a "selectNext" method.`
        );
        return false;
      } else {
        return this[internal.state] && this[internal.state].rightToLeft
          ? this.selectPrevious()
          : this.selectNext();
      }
    }

    /**
     * Invokes `selectFirst` to select the first item.
     */
    [internal.goStart]() {
      if (super[internal.goStart]) {
        super[internal.goStart]();
      }
      if (!this.selectFirst) {
        /* eslint-disable no-console */
        console.warn(
          `DirectionSelectionMixin expects ${this.constructor.name} to define a "selectFirst" method.`
        );
        return false;
      } else {
        return this.selectFirst();
      }
    }

    /**
     * Invokes `selectPrevious` to select the previous item.
     */
    [internal.goUp]() {
      if (super[internal.goUp]) {
        super[internal.goUp]();
      }
      if (!this.selectPrevious) {
        /* eslint-disable no-console */
        console.warn(
          `DirectionSelectionMixin expects ${this.constructor.name} to define a "selectPrevious" method.`
        );
        return false;
      } else {
        return this.selectPrevious();
      }
    }
  }

  return DirectionSelection;
}
