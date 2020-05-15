import CarouselSlideshow from "../base/CarouselSlideshow.js";
import DarkModeMixin from "../base/DarkModeMixin.js";
import { defaultState } from "../base/internal.js";
import PlainArrowDirectionMixin from "./PlainArrowDirectionMixin.js";
import PlainCarouselMixin from "./PlainCarouselMixin.js";
import PlainPageDot from "./PlainPageDot.js";

/**
 * CarouselSlideshow component in the Plain reference design system
 *
 * @inherits CarouselSlideshow
 * @mixes DarkModeMixin
 * @mixes PlainArrowDirectionMixin
 * @mixes PlainCarouselMixin
 * @part {PlainPageDot} proxy
 */
class PlainCarouselSlideshow extends DarkModeMixin(
  PlainArrowDirectionMixin(PlainCarouselMixin(CarouselSlideshow))
) {
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      proxyPartType: PlainPageDot,
    });
  }
}

export default PlainCarouselSlideshow;
