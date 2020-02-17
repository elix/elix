import * as internal from "../base/internal.js";
import html from "../core/html.js";
import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars

/**
 * Carousel styles in the Plain reference design system
 *
 * @module PlainCarouselMixin
 * @param {Constructor<ReactiveElement>} Base
 */
export default function PlainCarouselMixin(Base) {
  return class PlainCarousel extends Base {
    get [internal.template]() {
      const result = super[internal.template];
      result.content.append(
        html`
          <style>
            .arrowButton {
              font-size: 48px;
            }
          </style>
        `
      );
      return result;
    }
  };
}
