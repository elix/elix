import './Thumbnail.js';
import { merge } from './updates.js'
import Carousel from './Carousel.js';


/**
 * A carousel for showing images. Each image is represented with a small
 * thumbnail.
 * 
 * @inherits Carousel
 * @elementtag {Thumbnail} proxy
 */
class CarouselWithThumbnails extends Carousel {

  get defaults() {
    const base = super.defaults || {};
    return Object.assign({}, base, {
      tags: Object.assign({}, base.tags, {
        proxy: 'elix-thumbnail'
      })
    });
  }
  
  get defaultState() {
    return Object.assign({}, super.defaultState, {
      listOverlap: false
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
