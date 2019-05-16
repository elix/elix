import * as symbols from './symbols.js';


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
 */
export default function DirectionSelectionMixin(Base) {

  // The class prototype added by the mixin.
  class DirectionSelection extends Base {

    get defaultState() {
      const state = Object.assign(super.defaultState, {
        canGoLeft: null,
        canGoRight: null
      });

      // Update computed state members canGoLeft/canGoRight.
      // TODO: Account for state.orientation, add canGoDown/canGoUp.
      state.onChange(['languageDirection', 'canSelectNext', 'canSelectPrevious'], state => {
        const { canSelectNext, canSelectPrevious, rightToLeft } = state;
        const canGoLeft = rightToLeft ? canSelectNext : canSelectPrevious;
        const canGoRight = rightToLeft ? canSelectPrevious : canSelectNext;
        return {
          canGoLeft,
          canGoRight
        };
      });

      return state;
    }

    /**
     * Invokes `selectNext` to select the next item.
     */
    [symbols.goDown]() {
      if (super[symbols.goDown]) { super[symbols.goDown](); }
      if (!this.selectNext) {
        /* eslint-disable no-console */
        console.warn(`DirectionSelectionMixin expects ${this.constructor.name} to define a "selectNext" method.`);
        return false;
      } else {
        return this.selectNext();
      }
    }

    /**
     * Invokes `selectLast` to select the next item.
     */
    [symbols.goEnd]() {
      if (super[symbols.goEnd]) { super[symbols.goEnd](); }
      if (!this.selectLast) {
        /* eslint-disable no-console */
        console.warn(`DirectionSelectionMixin expects ${this.constructor.name} to define a "selectLast" method.`);
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
    [symbols.goLeft]() {
      if (super[symbols.goLeft]) { super[symbols.goLeft](); }
      if (!this.selectPrevious) {
        /* eslint-disable no-console */
        console.warn(`DirectionSelectionMixin expects ${this.constructor.name} to define a "selectPrevious" method.`);
        return false;
      } else {
        return this.state && this.state.rightToLeft ?
          this.selectNext() :
          this.selectPrevious();
      }
    }

    /**
     * Invokes `selectNext` to select the next item.
     * 
     * If the element has a `rightToLeft` property and it is true, then this
     * selects the _previous_ item.
     */
    [symbols.goRight]() {
      if (super[symbols.goRight]) { super[symbols.goRight](); }
      if (!this.selectNext) {
        /* eslint-disable no-console */
        console.warn(`DirectionSelectionMixin expects ${this.constructor.name} to define a "selectNext" method.`);
        return false;
      } else {
        return this.state && this.state.rightToLeft ?
          this.selectPrevious() :
          this.selectNext();
      }
    }

    /**
     * Invokes `selectFirst` to select the first item.
     */
    [symbols.goStart]() {
      if (super[symbols.goStart]) { super[symbols.goStart](); }
      if (!this.selectFirst) {
        /* eslint-disable no-console */
        console.warn(`DirectionSelectionMixin expects ${this.constructor.name} to define a "selectFirst" method.`);
        return false;
      } else {
        return this.selectFirst();
      }
    }

    /**
     * Invokes `selectPrevious` to select the previous item.
     */
    [symbols.goUp]() {
      if (super[symbols.goUp]) { super[symbols.goUp](); }
      if (!this.selectPrevious) {
        /* eslint-disable no-console */
        console.warn(`DirectionSelectionMixin expects ${this.constructor.name} to define a "selectPrevious" method.`);
        return false;
      } else {
        return this.selectPrevious();
      }
    }

  }

  return DirectionSelection;
}
