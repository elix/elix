import * as internal from "../base/internal.js";
import CarouselWithThumbnails from "../base/CarouselWithThumbnails.js";
import PlainArrowDirectionButton from "./PlainArrowDirectionButton.js";
import PlainArrowDirectionIconsMixin from "./PlainArrowDirectionMixin.js";
import PlainCarouselMixin from "./PlainCarouselMixin.js";
import PlainCenteredStripOpacity from "./PlainCenteredStripOpacity.js";
import PlainThumbnail from "./PlainThumbnail.js";

class PlainCarouselWithThumbnails extends PlainArrowDirectionIconsMixin(
  PlainCarouselMixin(CarouselWithThumbnails)
) {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      arrowButtonPartType: PlainArrowDirectionButton,
      proxyListPartType: PlainCenteredStripOpacity,
      proxyPartType: PlainThumbnail
    });
  }
}

export default PlainCarouselWithThumbnails;
