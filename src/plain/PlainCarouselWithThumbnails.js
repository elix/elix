import * as internal from "../base/internal.js";
import CarouselWithThumbnails from "../base/CarouselWithThumbnails.js";
import html from "../core/html.js";
import PlainArrowDirectionButton from "./PlainArrowDirectionButton.js";
import PlainArrowDirectionMixin from "./PlainArrowDirectionMixin.js";
import PlainCarouselMixin from "./PlainCarouselMixin.js";

/**
 * CarouselWithThumbnails component in the Plain reference design system
 *
 * @inherits CarouselWithThumbnails
 * @mixes PlainArrowDirectionMixin
 * @mixes PlainCarouselMixin
 * @part {PlainArrowDirectionButton} arrow-button
 * @part {PlainCenteredStripOpacity} proxy-list
 */
class PlainCarouselWithThumbnails extends PlainArrowDirectionMixin(
  PlainCarouselMixin(CarouselWithThumbnails)
) {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      arrowButtonPartType: PlainArrowDirectionButton
    });
  }

  get [internal.template]() {
    const result = super[internal.template];

    result.content.append(
      html`
        <style>
          [part~="proxy"] {
            height: var(--elix-thumbnail-height, 4em);
            width: var(--elix-thumbnail-width, 6em);
            object-fit: contain;
          }
        </style>
      `
    );

    return result;
  }
}

export default PlainCarouselWithThumbnails;
