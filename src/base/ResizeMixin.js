import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars
import {
  checkSize,
  defaultState,
  rendered,
  setState,
  state,
} from "./internal.js";

/** @type {any} */ let resizeObserver;
/** @type {Element[]} */ const windowResizeEntries = [];

/**
 * Lets a component know when it has been resized.
 *
 * If/when the component changes size, this mixin updates the `clientHeight` and
 * `clientWidth` state members.
 *
 * This mixin can only guarantee results on browsers that support
 * `ResizeObserver` (as of 22 Mar 2018, only Google Chrome).
 *
 * On other browsers, the mixin will check the component's size when it is first
 * mounted and when it's finished rendering. It will also check the size if the
 * window resizes. This can catch most cases, but is somewhat inefficient, and
 * misses cases where a component changes size for reasons beyond the
 * component's awareness (e.g., CSS finished loading, something else on the page
 * changed that forced a change in the component's size).
 *
 * @module ResizeMixin
 * @param {Constructor<ReactiveElement>} Base
 */
export default function ResizeMixin(Base) {
  return class Resize extends Base {
    // Check this element's current height and width and, if either has changed,
    // update the corresponding state members.
    [checkSize]() {
      if (super[checkSize]) {
        super[checkSize]();
      }
      const { clientHeight, clientWidth } = this;
      const sizeChanged =
        clientHeight !== this[state].clientHeight ||
        clientWidth !== this[state].clientWidth;
      if (sizeChanged) {
        this[setState]({
          clientHeight,
          clientWidth,
        });
      }
    }

    // TODO: Unobserve component if it's disconnected.
    connectedCallback() {
      if (super.connectedCallback) {
        super.connectedCallback();
      }
      if (resizeObserver) {
        resizeObserver.observe(this);
      } else {
        windowResizeEntries.push(this);
      }
    }

    get [defaultState]() {
      return Object.assign(super[defaultState] || {}, {
        clientHeight: this.clientHeight,
        clientWidth: this.clientWidth,
      });
    }

    disconnectedCallback() {
      if (super.disconnectedCallback) {
        super.disconnectedCallback();
      }
      if (resizeObserver) {
        resizeObserver.unobserve(this);
      }
    }

    [rendered](/** @type {ChangedFlags} */ changed) {
      if (super[rendered]) {
        super[rendered](changed);
      }

      this[checkSize]();
    }
  };
}

// Is ResizeObserve supported?
const Observer = window["ResizeObserver"];
if (typeof Observer !== "undefined") {
  // Use ResizeObserver.
  resizeObserver = new Observer((/** @type {any[]} */ entries) => {
    entries.forEach((entry) => {
      // In theory, the "content size" reported by ResizeObserver appears to be
      // the same as the clientHeight/clientWidth. Neither should include
      // padding. But since this theory is not explicitly confirmed by the
      // ResizeObserver docs, it seems safest to reference the element's current
      // client size.
      const { target } = entry;
      const { clientHeight, clientWidth } = target;
      target[setState]({
        clientHeight,
        clientWidth,
      });
    });
  });
} else {
  // Fall back to only tracking window resize.
  window.addEventListener("resize", () => {
    windowResizeEntries.forEach((entry) => {
      entry[checkSize]();
    });
  });
}
