import { merge } from './updates.js'
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

  proxyUpdates(proxy, calcs) {
    const base = super.proxyUpdates(proxy, calcs);
    const item = calcs.item;
    return merge(base, {
      attributes: {
        src: item.src
      }
    });
  }

}


customElements.define('elix-carousel-with-thumbnails', CarouselWithThumbnails);
export default CarouselWithThumbnails;
