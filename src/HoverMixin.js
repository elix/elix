import symbols from './symbols.js';


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
        this.mouseEnter(event);
        this[symbols.raiseChangeEvents] = false;
      });
      this.addEventListener('mouseleave', event => {
        this[symbols.raiseChangeEvents] = true;
        this.mouseLeave(event);
        this[symbols.raiseChangeEvents] = false;
      });
    }

    get defaultState() {
      return Object.assign({}, super.defaultState, {
        hover: false
      })
    }

    mouseEnter(event) {
      if (super.mouseEnter) { super.mouseEnter(event); }
      this.setState({
        hover: true
      });
    }

    mouseLeave(event) {
      if (super.mouseLeave) { super.mouseLeave(event); }
      this.setState({
        hover: false
      });
    }

  }
}