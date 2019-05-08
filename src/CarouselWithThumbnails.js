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

  [symbols.render](state, changed) {
    super[symbols.render](state, changed);
    const proxies = state.defaultProxies.length > 0 ?
      state.defaultProxies :
      state.assignedProxies;
    if ((changed.assignedProxies || changed.defaultProxies || changed.items)
        && proxies) {
      // Update thumbnails.
      const { items } = state;
      proxies.forEach((proxy, index) => {
        const item = items[index];
        if (item) {
          proxy.src = items[index].src;
        }
      });
    }
  }

}


customElements.define('elix-carousel-with-thumbnails', CarouselWithThumbnails);
export default CarouselWithThumbnails;
