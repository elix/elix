import symbols from './symbols.js';


export default function HoverMixin(Base) {
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