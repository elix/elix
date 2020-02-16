import * as internal from "../base/internal.js";
import ArrowDirectionButton from "./ArrowDirectionButton.js";
import CarouselSlideshow from "../base/CarouselSlideshow.js";
import CenteredStripOpacity from "./CenteredStripOpacity.js";
import PageDot from "./PageDot.js";
import PlainCarouselMixin from "./PlainCarouselMixin.js";

class PlainCarouselSlideshow extends PlainCarouselMixin(CarouselSlideshow) {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      arrowButtonPartType: ArrowDirectionButton,
      proxyListPartType: CenteredStripOpacity,
      proxyPartType: PageDot
    });
  }
}

export default PlainCarouselSlideshow;
