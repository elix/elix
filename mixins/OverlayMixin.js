import Symbol from '../mixins/Symbol.js';
import symbols from '../mixins/symbols.js';


const resolveOpenSymbol = Symbol('resolveOpen');
const previousFocusedElementSymbol = Symbol('previousFocusedElement');


export default function OverlayMixin(base) {

  // The class prototype added by the mixin.
  class Overlay extends base {

    [symbols.afterTransition](transition) {
      if (super[symbols.afterTransition]) { super[symbols.afterTransition](transition); }
      switch (transition) {
        case 'closing':
          makeVisible(this, false);
          this.style.zIndex = null;
          break;
      }
    }

    [symbols.applyTransition](transition) {
      // Default transition does nothing.
      return super[symbols.applyTransition] ? super[symbols.applyTransition](transition) : Promise.resolve();
    }

    [symbols.beforeTransition](transition) {
      if (super[symbols.beforeTransition]) { super[symbols.beforeTransition](transition); }
      switch (transition) {
        case 'opening':
          this[previousFocusedElementSymbol] = document.activeElement;
          const zIndex = maxZIndexInUse();
          this.style.zIndex = zIndex + 1;
          makeVisible(this, true);
          this.focus();
          break;

        case 'closing':
          if (this[previousFocusedElementSymbol]) {
            this[previousFocusedElementSymbol].focus();
          }
          break;
      }
    }

    close(result) {
      if (super.close) { super.close(); }
      if (this[resolveOpenSymbol]) {
        // Dialog was invoked with show().
        const resolve = this[resolveOpenSymbol];
        this[resolveOpenSymbol] = null;
        this.parentNode.removeChild(this);
        resolve(result);
      }
    }

    connectedCallback() {
      if (super.connectedCallback) { super.connectedCallback(); }
      // attributes.writePendingAttributes(this);
      this.setAttribute('tabindex', '0');
      if (this.opened) {
        makeVisible(this, this.opened);
      }
    }

    [symbols.keydown](event) {
      let handled = false;

      switch (event.keyCode) {
        case 27: // Escape
          this.close();
          handled = true;
          break;
      }

      // Prefer mixin result if it's defined, otherwise use base result.
      return handled || (super[symbols.keydown] && super[symbols.keydown](event)) || false;
    }

    show() {
      document.body.appendChild(this);
      this.open();
      const promise = new Promise((resolve, reject) => {
        this[resolveOpenSymbol] = resolve;
      });
      return promise;
    }

    get [symbols.template]() {
      return `
        <style>
          :host {
            height: 100%;
            left: 0;
            outline: none;
            position: fixed;
            top: 0;
            width: 100%;
          }

          :host(:not(.visible)) {
            display: none;
          }

          #backdrop {
            height: 100%;
            left: 0;
            position: absolute;
            top: 0;
            user-select: none;
            -webkit-tap-highlight-color: transparent;
            width: 100%;
          }

          #popupContent {
            position: relative;
          }
        </style>
        <div id="backdrop" role="none"></div>
        <div id="popupContent" role="none">
          <slot></slot>
        </div>
      `;
    }
  }

  return Overlay;

}


function makeVisible(element, visible) {
  element.classList.toggle('visible', visible);
}


function maxZIndexInUse() {
  const elements = document.body.querySelectorAll('*');
  const zIndices = Array.prototype.map.call(elements, element => {
    const style = getComputedStyle(element);
    let zIndex = 0;
    if (style.position !== 'static' && style.zIndex !== 'auto') {
      const parsed = parseInt(style.zIndex);
      zIndex = !isNaN(parsed) ? parsed : 0;
    }
    return zIndex;
  });
  return Math.max(...zIndices);
}
