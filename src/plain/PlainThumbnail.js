import * as internal from "../base/internal.js";
import * as template from "../core/template.js";
import WrappedStandardElement from "../base/WrappedStandardElement.js";

/**
 * A thumbnail for a larger image in the Plain reference design system
 *
 * [PlainCarouselWithThumbnails](PlainCarouselWithThumbnails) uses `Thumbnail`
 * as the default "proxy" element for list items.
 *
 * @inherits WrappedStandardElement
 */
class PlainThumbnail extends WrappedStandardElement.wrap("img") {
  get [internal.template]() {
    const result = super[internal.template];
    result.content.append(
      template.html`
        <style>
          #inner {
            height: var(--elix-thumbnail-height, 100%);
            width: var(--elix-thumbnail-width, 100%);
            object-fit: contain;
          }
        </style>
      `.content
    );
    return result;
  }
}

export default PlainThumbnail;
