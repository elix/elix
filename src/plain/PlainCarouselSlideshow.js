import * as internal from "../base/internal.js";
import CarouselSlideshow from "../base/CarouselSlideshow.js";
import DarkModeMixin from "../base/DarkModeMixin.js";
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
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      proxyPartType: PlainPageDot
    });
  }
}

export default PlainCarouselSlideshow;
