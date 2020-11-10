import Carousel from "../base/Carousel.js";
import DarkModeMixin from "../base/DarkModeMixin.js";
import { defaultState } from "../base/internal.js";
import PlainArrowDirectionMixin from "./PlainArrowDirectionMixin.js";
import PlainCarouselMixin from "./PlainCarouselMixin.js";
import PlainPageDot from "./PlainPageDot.js";

/**
 * Carousel component in the Plain reference design system
 *
 * @inherits Carousel
 * @mixes DarkModeMixin
 * @mixes PlainArrowDirectionMixin
 * @mixes PlainCarouselMixin
 * @part {PlainPageDot} proxy
 */
class PlainCarousel extends DarkModeMixin(
  PlainArrowDirectionMixin(PlainCarouselMixin(Carousel))
) {
  // @ts-ignore
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      proxyPartType: PlainPageDot,
    });
  }
}

export default PlainCarousel;
