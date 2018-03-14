import './CustomArrowButton.js';
import { merge } from '../../src/updates.js';
import Carousel from '../../src/Carousel.js';


// Shows how to change the glyphs used in the arrow buttons.
class CustomCarousel extends Carousel {

  get updates() {
    const arrowButtonStyle = {
      'font-size': '28px',
      'font-weight': 'bold',
      padding: '0.5em'
    };
    return merge(super.updates, {
      $: {
        arrowButtonLeft: {
          style: arrowButtonStyle,
          textContent: "↫"
        },
        arrowButtonRight: {
          style: arrowButtonStyle,
          textContent: "↬"
        }
      }
    });
  }

}


customElements.define('custom-carousel', CustomCarousel);
export default CustomCarousel;
