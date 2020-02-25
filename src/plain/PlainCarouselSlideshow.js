import * as internal from "../base/internal.js";
import CarouselSlideshow from "../base/CarouselSlideshow.js";
import PageDot from "./PlainPageDot.js";
import PlainArrowDirectionMixin from "./PlainArrowDirectionMixin.js";
import PlainCarouselMixin from "./PlainCarouselMixin.js";
import PlainCenteredStripOpacity from "./PlainCenteredStripOpacity.js";

/**
 * CarouselSlideshow component in the Plain reference design system
 *
 * @inherits CarouselSlideshow
 * @mixes PlainArrowDirectionMixin
 * @mixes PlainCarouselMixin
 * @part {PlainCenteredStripOpacity} proxy-list
 * @part {PageDot} proxy
 */
class PlainCarouselSlideshow extends PlainArrowDirectionMixin(
  PlainCarouselMixin(CarouselSlideshow)
) {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      proxyListPartType: PlainCenteredStripOpacity,
      proxyPartType: PageDot
    });
  }
}

export default PlainCarouselSlideshow;
