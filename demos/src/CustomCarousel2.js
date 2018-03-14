import './CustomArrowButton.js';
import './CustomPageDot.js';
import Carousel from '../../src/Carousel.js';


// Shows how a carousel subclass can define custom tags for the arrows and dots.
class CustomCarousel extends Carousel {

  get defaults() {
    const base = super.defaults || {};
    return Object.assign({}, base, {
      tags: Object.assign({}, base.tags, {
        arrowButton: 'custom-arrow-button',
        proxy: 'custom-page-dot'
      })
    });
  }

}


customElements.define('custom-carousel', CustomCarousel);
export default CustomCarousel;
