import symbols from './symbols.js';


/**
 * Mixin which maps direction semantics (goLeft, goRight, etc.) to selection
 * semantics (selectPrevious, selectNext, etc.).
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

    get [symbols.canGoLeft]() {
      const canSelect = this.rightToLeft ?
        this.canSelectNext :
        this.canSelectPrevious; 
      // Assume we can go left unless component tells us otherwise.
      return typeof canSelect === undefined ?
        true :
        canSelect;
    }

    get [symbols.canGoRight]() {
      const canSelect = this.rightToLeft ?
        this.canSelectPrevious :
        this.canSelectNext; 
      // Assume we can go right unless component tells us otherwise.
      return typeof canSelect === undefined ? 
        true :
        canSelect;
    }

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

    [symbols.goLeft]() {
      if (super[symbols.goLeft]) { super[symbols.goLeft](); }
      if (!this.selectPrevious) {
        /* eslint-disable no-console */
        console.warn(`DirectionSelectionMixin expects ${this.constructor.name} to define a "selectPrevious" method.`);
        return false;
      } else {
        return this.rightToLeft ?
          this.selectNext() :
          this.selectPrevious();
      }
    }

    [symbols.goRight]() {
      if (super[symbols.goRight]) { super[symbols.goRight](); }
      if (!this.selectNext) {
        /* eslint-disable no-console */
        console.warn(`DirectionSelectionMixin expects ${this.constructor.name} to define a "selectNext" method.`);
        return false;
      } else {
        return this.rightToLeft ?
          this.selectPrevious() :
          this.selectNext();
      }
    }

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
