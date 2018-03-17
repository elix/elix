import './Thumbnail.js';
import Carousel from './Carousel.js';


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

  setProxyItem(proxy, item) {
    super.setProxyItem(proxy, item);
    if (item.src !== undefined) {
      proxy.src = item.src;
    }
  }

}


customElements.define('elix-carousel-with-thumbnails', CarouselWithThumbnails);
export default CarouselWithThumbnails;
