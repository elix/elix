import * as symbols from './symbols.js';


/**
 * Mixin which tracks whether the user has moved the mouse over a component so
 * the component can decide whether to render hover effects.
 * 
 * @module HoverMixin
 */
export default function HoverMixin(Base) {

  // The class prototype added by the mixin.
  return class Hover extends Base {

    constructor() {
      // @ts-ignore
      super();
      this.addEventListener('mouseenter', event => {
        this[symbols.raiseChangeEvents] = true;
        this[symbols.mouseenter](event);
        this[symbols.raiseChangeEvents] = false;
      });
      this.addEventListener('mouseleave', event => {
        this[symbols.raiseChangeEvents] = true;
        this[symbols.mouseleave](event);
        this[symbols.raiseChangeEvents] = false;
      });
    }

    get defaultState() {
      return Object.assign({}, super.defaultState, {
        hover: false
      })
    }

    /**
     * See [symbols.mouseenter](symbols#mouseenter).
     */
    [symbols.mouseenter](event) {
      if (super[symbols.mouseenter]) { super[symbols.mouseenter](event); }
      this.setState({
        hover: true
      });
    }

    /**
     * See [symbols.mouseenter](symbols#mouseenter).
     */
    [symbols.mouseleave](event) {
      if (super[symbols.mouseleave]) { super[symbols.mouseleave](event); }
      this.setState({
        hover: false
      });
    }

  }
}
