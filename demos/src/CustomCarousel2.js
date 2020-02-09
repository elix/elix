import * as internal from "../../src/base/internal.js";
import Carousel from "../../src/base/Carousel.js";
import CustomArrowButton from "./CustomArrowButton.js";
import CustomPageDot from "./CustomPageDot.js";

// Shows how a carousel subclass can define custom part types for the arrows and
// dots.
class CustomCarousel extends Carousel {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      arrowButtonPartType: CustomArrowButton,
      proxyPartType: CustomPageDot
    });
  }
}

customElements.define("custom-carousel", CustomCarousel);
export default CustomCarousel;
