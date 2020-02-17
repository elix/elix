import * as internal from "../base/internal.js";
import Carousel from "../base/Carousel.js";
import PlainArrowDirectionButton from "./PlainArrowDirectionButton.js";
import PlainArrowDirectionMixin from "./PlainArrowDirectionMixin.js";
import PlainCarouselMixin from "./PlainCarouselMixin.js";
import PlainCenteredStripOpacity from "./PlainCenteredStripOpacity.js";
import PlainPageDot from "./PlainPageDot.js";

/**
 * Carousel component in the Plain reference design system

 * @inherits Carousel
 * @mixes PlainArrowDirectionMixin
 * @mixes PlainCarouselMixin
 */
class PlainCarousel extends PlainArrowDirectionMixin(
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
