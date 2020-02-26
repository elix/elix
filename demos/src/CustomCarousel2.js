import * as internal from "../../src/base/internal.js";
import CustomArrowButton from "./CustomArrowButton.js";
import CustomPageDot from "./CustomPageDot.js";
import PlainCarousel from "../../src/plain/PlainCarousel.js";

// Shows how a carousel subclass can define custom part types for the arrows and
// dots.
class CustomCarousel extends PlainCarousel {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      arrowButtonPartType: CustomArrowButton,
      proxyPartType: CustomPageDot
    });
  }
}

customElements.define("custom-carousel", CustomCarousel);
export default CustomCarousel;
