import * as internal from "../base/internal.js";
import ArrowDirectionButton from "./ArrowDirectionButton.js";
import Carousel from "../base/Carousel.js";

/**
 * @part {ArrowDirectionButton} arrow-button - both of the arrow buttons
 */
class PlainCarousel extends Carousel {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      arrowButtonPartType: ArrowDirectionButton
    });
  }
}

export default PlainCarousel;
