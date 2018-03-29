let resizeObserver;


/**
 * Mixin that notifies a component it has been resized by setting
 * `contentHeight` and `contentWidth` state members. This mixin only has an
 * effect on browsers that support `ResizeObserver` (as of 22 Mar 2018, only
 * Google Chrome).
 * 
 * @module ResizeMixin
 */
export default function ResizeMixin(Base) {
  return class Resize extends Base {

    connectedCallback() {
      if (super.connectedCallback) { super.connectedCallback(); }
      if (resizeObserver) {
        resizeObserver.observe(this);
      }
    }

    disconnectedCallback() {
      if (super.disconnectedCallback) { super.disconnectedCallback(); }
      if (resizeObserver) {
        resizeObserver.unobserve(this);
      }
    }
    
  }
}


const Observer = window['ResizeObserver'];
if (typeof Observer !== 'undefined') {
  resizeObserver = new Observer(entries => {
    entries.forEach(entry => {
      const { target, contentRect } = entry;
      const { height, width } = contentRect;
      target.setState({
        contentHeight: height,
        contentWidth: width
      });
    });
  });
}
