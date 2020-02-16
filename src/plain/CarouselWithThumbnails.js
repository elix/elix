import * as internal from "../base/internal.js";
import ArrowDirectionButton from "./ArrowDirectionButton.js";
import CarouselWithThumbnails from "../base/CarouselWithThumbnails.js";
import CenteredStripOpacity from "./CenteredStripOpacity.js";
import PlainCarouselMixin from "./PlainCarouselMixin.js";
import Thumbnail from "./Thumbnail.js";

class PlainCarouselWithThumbnails extends PlainCarouselMixin(
  CarouselWithThumbnails
) {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      arrowButtonPartType: ArrowDirectionButton,
      proxyListPartType: CenteredStripOpacity,
      proxyPartType: Thumbnail
    });
  }
}

export default PlainCarouselWithThumbnails;
