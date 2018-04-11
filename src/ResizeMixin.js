let resizeObserver;


/**
 * Mixin that notifies a component it has been resized by setting
 * `clientHeight` and `clientWidth` state members.
 * 
 * This mixin can only guarantee results on browsers that support
 * `ResizeObserver` (as of 22 Mar 2018, only Google Chrome). On other browsers,
 * the mixin will check the component's size when it is first mounted, and
 * thereafter when it's finished rendering. This can catch most cases, but is
 * somewhat inefficient, and misses cases where a component changes size for
 * reasons beyond the component's awareness (e.g., CSS finished loading,
 * something else on the page changed that forced a change in the component's
 * size).
 * 
 * @module ResizeMixin
 */
export default function ResizeMixin(Base) {
  return class Resize extends Base {

    // Check this element's current height and width and, if either has changed,
    // update the corresponding state members.
    checkSize() {
      const { clientHeight, clientWidth } = this;
      const sizeChanged = clientHeight !== this.state.clientHeight ||
          clientWidth !== this.state.clientWidth;
      console.log(clientHeight, clientWidth, sizeChanged);
      if (sizeChanged) {
        this.setState({
          clientHeight,
          clientWidth
        });
      }
    }
    connectedCallback() {
      if (super.connectedCallback) { super.connectedCallback(); }
      if (resizeObserver) {
        resizeObserver.observe(this);
      }
    }

    componentDidMount() {
      if (super.componentDidMount) { super.componentDidMount(); }
      this.checkSize();
    }
    
    componentDidUpdate(previousState) {
      if (super.componentDidUpdate) { super.componentDidUpdate(previousState); }
      this.checkSize();
    }

    get defaultState() {
      return Object.assign({}, super.defaultState, {
        offsetHeight: this.offsetHeight,
        offsetWidth: this.offsetWidth
      });
    }

    disconnectedCallback() {
      if (super.disconnectedCallback) { super.disconnectedCallback(); }
      if (resizeObserver) {
        resizeObserver.unobserve(this);
      }
    }
    
  }
}


// Create a ResizeObserve if that's supported.
const Observer = window['ResizeObserver'];
if (typeof Observer !== 'undefined') {
  resizeObserver = new Observer(entries => {
    entries.forEach(entry => {
      // In theory, the "content size" reported by ResizeObserver appears to be
      // the same as the clientHeight/clientWidth. Neither should include
      // padding. But since this theory is not explicitly confirmed by the
      // ResizeObserver docs, it seems safest to reference the element's current
      // client size.
      const { target } = entry;
      const { clientHeight, clientWidth } = target;
      target.setState({
        clientHeight,
        clientWidth
      });
    });
  });
}
