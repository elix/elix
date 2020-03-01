import * as internal from "../base/internal.js";
import html from "../core/html.js";
import PlainCenteredStripOpacity from "./PlainCenteredStripOpacity.js";
import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars

/**
 * Carousel styles in the Plain reference design system
 *
 * @module PlainCarouselMixin
 * @param {Constructor<ReactiveElement>} Base
 * @part {PlainCenteredStripOpacity} proxy-list
 */
export default function PlainCarouselMixin(Base) {
  return class PlainCarousel extends Base {
    get [internal.defaultState]() {
      return Object.assign(super[internal.defaultState], {
        proxyListPartType: PlainCenteredStripOpacity
      });
    }

    get [internal.template]() {
      const result = super[internal.template];
      result.content.append(
        html`
          <style>
            [part~="arrow-icon"] {
              font-size: 48px;
            }
          </style>
        `
      );
      return result;
    }
  };
}
