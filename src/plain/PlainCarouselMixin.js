import * as internal from "../base/internal.js";
import * as template from "../core/template.js";

export default function PlainCarouselMixin(Base) {
  return class PlainCarousel extends Base {
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
  };
}
