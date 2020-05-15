import { defaultState } from "../../src/base/internal.js";
import PlainCarousel from "../../src/plain/PlainCarousel.js";
import CustomArrowButton from "./CustomArrowButton.js";
import CustomPageDot from "./CustomPageDot.js";

// Shows how a carousel subclass can define custom part types for the arrows and
// dots.
class CustomCarousel extends PlainCarousel {
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      arrowButtonPartType: CustomArrowButton,
      proxyPartType: CustomPageDot,
    });
  }
}

customElements.define("custom-carousel", CustomCarousel);
export default CustomCarousel;
