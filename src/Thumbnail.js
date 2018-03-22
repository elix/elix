import * as symbols from './symbols.js';
import WrappedStandardElement from "./WrappedStandardElement.js";


class Thumbnail extends WrappedStandardElement.wrap('img') {

  get [symbols.template]() {
    return `
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
