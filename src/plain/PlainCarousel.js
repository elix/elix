import * as internal from "../base/internal.js";
import Carousel from "../base/Carousel.js";
import PlainArrowDirectionMixin from "./PlainArrowDirectionMixin.js";
import PlainCarouselMixin from "./PlainCarouselMixin.js";
import PlainPageDot from "./PlainPageDot.js";

/**
 * Carousel component in the Plain reference design system
 *
 * @inherits Carousel
 * @mixes PlainArrowDirectionMixin
 * @mixes PlainCarouselMixin
 * @part {PlainPageDot} proxy
 */
class PlainCarousel extends PlainArrowDirectionMixin(
  PlainCarouselMixin(Carousel)
) {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      proxyPartType: PlainPageDot
    });
  }
}

export default PlainCarousel;
