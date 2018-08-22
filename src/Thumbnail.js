import * as symbols from './symbols.js';
import * as template from './template.js';
import WrappedStandardElement from "./WrappedStandardElement.js";


/**
 * A thumbnail image used as a proxy element to represent an image in a
 * [CarouselWithThumbnails](CarouselWithThumbnails).
 * 
 * @inherits WrappedStandardElement
 */
class Thumbnail extends WrappedStandardElement.wrap('img') {

  get [symbols.template]() {
    return template.html`
      <style>
        :host {
          display: inline-block;
          position: relative;
        }

        #inner {
          height: var(--elix-thumbnail-height, 100%);
          width: var(--elix-thumbnail-width, 100%);
          object-fit: contain;
        }
      </style>
      <img id="inner">
    `;
  }

}


customElements.define('elix-thumbnail', Thumbnail);
export default Thumbnail;
