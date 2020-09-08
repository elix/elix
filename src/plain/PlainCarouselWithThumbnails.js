import CarouselWithThumbnails from "../base/CarouselWithThumbnails.js";
import DarkModeMixin from "../base/DarkModeMixin.js";
import { defaultState, template } from "../base/internal.js";
import { fragmentFrom } from "../core/htmlLiterals.js";
import PlainArrowDirectionButton from "./PlainArrowDirectionButton.js";
import PlainArrowDirectionMixin from "./PlainArrowDirectionMixin.js";
import PlainCarouselMixin from "./PlainCarouselMixin.js";

/**
 * CarouselWithThumbnails component in the Plain reference design system
 *
 * @inherits CarouselWithThumbnails
 * @mixes DarkModeMixin
 * @mixes PlainArrowDirectionMixin
 * @mixes PlainCarouselMixin
 * @part {PlainArrowDirectionButton} arrow-button
 * @part {PlainCenteredStripOpacity} proxy-list
 */
class PlainCarouselWithThumbnails extends DarkModeMixin(
  PlainArrowDirectionMixin(PlainCarouselMixin(CarouselWithThumbnails))
) {
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      arrowButtonPartType: PlainArrowDirectionButton,
    });
  }

  get [template]() {
    const result = super[template];

    result.content.append(
      fragmentFrom.html`
        <style>
          [part~=proxy] {
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
