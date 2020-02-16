import * as internal from "../base/internal.js";
import ArrowDirectionButton from "./ArrowDirectionButton.js";
import Carousel from "../base/Carousel.js";
import CenteredStripOpacity from "./CenteredStripOpacity.js";
import PageDot from "./PageDot.js";
import PlainArrowDirectionIconsMixin from "./PlainArrowDirectionIconsMixin.js";
import PlainCarouselMixin from "./PlainCarouselMixin.js";

class PlainCarousel extends PlainArrowDirectionIconsMixin(
  PlainCarouselMixin(Carousel)
) {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      arrowButtonPartType: ArrowDirectionButton,
      proxyListPartType: CenteredStripOpacity,
      proxyPartType: PageDot
    });
  }
}

export default PlainCarousel;
