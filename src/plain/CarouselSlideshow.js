import * as internal from "../base/internal.js";
import * as template from "../core/template.js";
import ArrowDirectionButton from "./ArrowDirectionButton.js";
import CarouselSlideshow from "../base/CarouselSlideshow.js";
import CenteredStripOpacity from "./CenteredStripOpacity.js";
import PageDot from "./PageDot.js";

class PlainCarouselSlideshow extends CarouselSlideshow {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      arrowButtonPartType: ArrowDirectionButton,
      proxyListPartType: CenteredStripOpacity,
      proxyPartType: PageDot
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

export default PlainCarouselSlideshow;
