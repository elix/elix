import * as symbols from './symbols.js';
import Carousel from './Carousel.js';
import Thumbnail from './Thumbnail.js';


/**
 * Carousel showing a thumbnail for each image
 * 
 * @inherits Carousel
 * @elementrole {Thumbnail} proxy
 */
class CarouselWithThumbnails extends Carousel {

  get defaultState() {
    return Object.assign(super.defaultState, {
      proxyListOverlap: false,
      proxyRole: Thumbnail
    });
  }

  [symbols.render](/** @type {PlainObject} */ changed) {
    super[symbols.render](changed);
    /** @type {Element[]} */ const proxies = this.state.proxies;
    if ((changed.items || changed.proxies) && proxies) {
      // Update thumbnails.
      const { items } = this.state;
      proxies.forEach((proxy, index) => {
        /** @type {any} */ const item = items[index];
        /** @type {any} */ const cast = proxy;
        if (item && 'src' in cast) {
          cast.src = item.src;
        }
      });
    }
  }

}


customElements.define('elix-carousel-with-thumbnails', CarouselWithThumbnails);
export default CarouselWithThumbnails;
