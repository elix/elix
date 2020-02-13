import Backdrop from "./Backdrop.js";

/**
 * Semi-transparent backdrop for a modal overlay
 *
 * This type of backdrop is used by [Dialog](Dialog) and [Drawer](Drawer). The
 * backdrop slightly obscures the background elements, focusing the user's
 * attention on the overlay.
 *
 * @inherits Backdrop
 */
class ModalBackdrop extends Backdrop {
  constructor() {
    super();

    // As of Sep 2018, Mobile Safari allows the user to drag on the backdrop to
    // scroll the page behind it, which violates the modality. To correct this,
    // we prevent touchmove events with one touch from performing the default
    // page scrolling.
    //
    // Android Chrome already correctly prevents drags from reaching the page,
    // so we only engage this workaround if we don't see support for pointer
    // events -- in which case we assume we're in Safari.
    if (!("PointerEvent" in window)) {
      this.addEventListener("touchmove", event => {
        if (event.touches.length === 1) {
          event.preventDefault();
        }
      });
    }
  }
}

export default ModalBackdrop;
