import * as internal from "../base/internal.js";
import * as template from "../core/template.js";
import ArrowDirectionButton from "./ArrowDirectionButton.js";
import Carousel from "../base/Carousel.js";

class PlainCarousel extends Carousel {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      arrowButtonPartType: ArrowDirectionButton
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

export default PlainCarousel;
