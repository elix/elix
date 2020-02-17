import * as internal from "../base/internal.js";
import Carousel from "../base/Carousel.js";
import PlainArrowDirectionButton from "./PlainArrowDirectionButton.js";
import PlainArrowDirectionIconsMixin from "./PlainArrowDirectionMixin.js";
import PlainCarouselMixin from "./PlainCarouselMixin.js";
import PlainCenteredStripOpacity from "./PlainCenteredStripOpacity.js";
import PlainPageDot from "./PlainPageDot.js";

class PlainCarousel extends PlainArrowDirectionIconsMixin(
  PlainCarouselMixin(Carousel)
) {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      arrowButtonPartType: PlainArrowDirectionButton,
      proxyListPartType: PlainCenteredStripOpacity,
      proxyPartType: PlainPageDot
    });
  }
}

export default PlainCarousel;
