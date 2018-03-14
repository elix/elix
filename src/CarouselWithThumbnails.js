import './Thumbnail.js';
import Carousel from './Carousel.js';


class CarouselWithThumbnails extends Carousel {

  get defaults() {
    const base = super.defaults || {};
    return Object.assign({}, base, {
      tags: Object.assign({}, base.tags, {
        proxy: 'custom-thumbnail'
      })
    });
  }
  
  get defaultState() {
    return Object.assign({}, super.defaultState, {
      listOverlap: false
    });
  }

}


customElements.define('elix-carousel-with-thumbnails', CarouselWithThumbnails);
export default CarouselWithThumbnails;
