import './CustomArrowButton.js';
import './CustomPageDot.js';
import SlidingCarousel from '../../src/SlidingCarousel.js';


// Shows how a carousel subclass can define custom tags for the arrows and dots.
class CustomCarousel extends SlidingCarousel {

  get defaultTags() {
    return Object.assign({}, super.defaultTags, {
      arrowButton: 'custom-arrow-button',
      pageDot: 'custom-page-dot'
    });
  }

}


customElements.define('custom-carousel', CustomCarousel);
export default CustomCarousel;
