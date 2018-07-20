import { merge } from './updates.js'
import Carousel from './Carousel.js';
import Thumbnail from './Thumbnail.js';


/**
 * A carousel for showing images. Each image is represented with a small
 * thumbnail.
 * 
 * @inherits Carousel
 * @elementtag {Thumbnail} proxy
 */
class CarouselWithThumbnails extends Carousel {

  constructor() {
    super();
    Object.assign(this.elementDescriptors, {
      proxy: Thumbnail
    });
  }
  
  get defaultState() {
    return Object.assign({}, super.defaultState, {
      proxyListOverlap: false
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
