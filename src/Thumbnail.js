import * as internal from './internal.js';
import * as template from './template.js';
import WrappedStandardElement from './WrappedStandardElement.js';

/**
 * A thumbnail image used to represent a larger image.
 *
 * [CarouselWithThumbnails](CarouselWithThumbnails) uses `Thumbnail` as the
 * default "proxy" element for list items.
 *
 * @inherits WrappedStandardElement
 */
class Thumbnail extends WrappedStandardElement.wrap('img') {
  get [internal.template]() {
    return template.concat(
      super[internal.template],
      template.html`
        <style>
          :host {
            position: relative;
          }

          #inner {
            height: var(--elix-thumbnail-height, 100%);
            width: var(--elix-thumbnail-width, 100%);
            object-fit: contain;
          }
        </style>
      `
    );
  }
}

export default Thumbnail;
