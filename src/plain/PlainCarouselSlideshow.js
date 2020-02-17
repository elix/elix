import * as internal from "../base/internal.js";
import CarouselSlideshow from "../base/CarouselSlideshow.js";
import PageDot from "./PlainPageDot.js";
import PlainArrowDirectionButton from "./PlainArrowDirectionButton.js";
import PlainArrowDirectionIconsMixin from "./PlainArrowDirectionMixin.js";
import PlainCarouselMixin from "./PlainCarouselMixin.js";
import PlainCenteredStripOpacity from "./PlainCenteredStripOpacity.js";

class PlainCarouselSlideshow extends PlainArrowDirectionIconsMixin(
  PlainCarouselMixin(CarouselSlideshow)
) {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      arrowButtonPartType: PlainArrowDirectionButton,
      proxyListPartType: PlainCenteredStripOpacity,
      proxyPartType: PageDot
    });
  }
}

export default PlainCarouselSlideshow;
