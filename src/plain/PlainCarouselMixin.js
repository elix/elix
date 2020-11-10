import { defaultState, render, state, template } from "../base/internal.js";
import { fragmentFrom } from "../core/htmlLiterals.js";
import ReactiveElement from "../core/ReactiveElement.js"; // eslint-disable-line no-unused-vars
import PlainCenteredStripOpacity from "./PlainCenteredStripOpacity.js";

/**
 * Carousel styles in the Plain reference design system
 *
 * @module PlainCarouselMixin
 * @param {Constructor<ReactiveElement>} Base
 * @part {PlainCenteredStripOpacity} proxy-list
 */
export default function PlainCarouselMixin(Base) {
  return class PlainCarousel extends Base {
    // @ts-ignore
    get [defaultState]() {
      return Object.assign(super[defaultState] || {}, {
        proxyListPartType: PlainCenteredStripOpacity,
      });
    }

    [render](changed) {
      if (super[render]) {
        super[render](changed);
      }

      const proxies = this.proxies;
      if (
        (changed.dark || changed.detectDarkMode || changed.proxies) &&
        proxies
      ) {
        // Apply dark mode to proxies.
        const { dark, detectDarkMode } = this[state];
        proxies.forEach((proxy) => {
          /** @type {any} */ const cast = proxy;
          if ("dark" in cast) {
            cast.dark = dark;
          }
          if ("detectDarkMode" in cast) {
            cast.detectDarkMode = detectDarkMode;
          }
        });
      }
    }

    get [template]() {
      const result = super[template];
      result.content.append(
        fragmentFrom.html`
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
