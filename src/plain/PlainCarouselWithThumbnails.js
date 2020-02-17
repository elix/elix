import * as internal from "../base/internal.js";
import * as template from "../core/template.js";
import CarouselWithThumbnails from "../base/CarouselWithThumbnails.js";
import PlainArrowDirectionButton from "./PlainArrowDirectionButton.js";
import PlainArrowDirectionMixin from "./PlainArrowDirectionMixin.js";
import PlainCarouselMixin from "./PlainCarouselMixin.js";
import PlainCenteredStripOpacity from "./PlainCenteredStripOpacity.js";

/**
 * CarouselWithThumbnails component in the Plain reference design system
 *
 * @inherits CarouselWithThumbnails
 * @mixes PlainArrowDirectionMixin
 * @mixes PlainCarouselMixin
 */
class PlainCarouselWithThumbnails extends PlainArrowDirectionMixin(
  PlainCarouselMixin(CarouselWithThumbnails)
) {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      arrowButtonPartType: PlainArrowDirectionButton,
      proxyListPartType: PlainCenteredStripOpacity
    });
  }

  get [internal.template]() {
    const result = super[internal.template];

    result.content.append(
      template.html`
        <style>
          [part~="proxy"] {
            height: var(--elix-thumbnail-height, 4em);
            width: var(--elix-thumbnail-width, 6em);
            object-fit: contain;
          }
        </style>
      `.content
    );

    return result;
  }
}

export default PlainCarouselWithThumbnails;
