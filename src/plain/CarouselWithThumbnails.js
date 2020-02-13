import * as internal from "../base/internal.js";
import * as template from "../core/template.js";
import ArrowDirectionButton from "./ArrowDirectionButton.js";
import CarouselWithThumbnails from "../base/CarouselWithThumbnails.js";
import CenteredStripOpacity from "../base/CenteredStripOpacity.js";
import Thumbnail from "./Thumbnail.js";

class PlainCarouselWithThumbnails extends CarouselWithThumbnails {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      arrowButtonPartType: ArrowDirectionButton,
      proxyListPartType: CenteredStripOpacity,
      proxyPartType: Thumbnail
    });
  }

  get [internal.template]() {
    const result = super[internal.template];
    result.content.append(
      template.html`
        <style>
          .arrowButton {
            font-size: 48px;
          }
        </style>
      `.content
    );
    return result;
  }
}

export default PlainCarouselWithThumbnails;
