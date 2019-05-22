import * as symbols from './symbols.js';
import Carousel from './Carousel.js';
import CrossfadeStage from './CrossfadeStage.js';
import TimerSelectionMixin from './TimerSelectionMixin.js';


const Base =
  TimerSelectionMixin(
    Carousel
  );


/**
 * Slideshow with carousel controls
 * 
 * [Carousel controls let the user directly access a specific page](/demos/carouselSlideshow.html)
 * 
 * For a variation that offers next/previous buttons and a pause/resume button,
 * see [SlideshowWithPlayControls](SlideshowWithPlayControls). For a more basic
 * variation with no controls, see [Slideshow](Slideshow).
 * 
 * @inherits Carousel
 * @mixes TimerSelectionMixin
 */
class CarouselSlideshow extends Base {

  get defaultState() {
    return Object.assign(super.defaultState, {
      playing: true,
      selectionTimerDuration: 3000,
      selectionWraps: true,
      stageRole: CrossfadeStage,
      transitionDuration: 1000
    });
  }

  [symbols.render](changed) {
    super[symbols.render](changed);
    if (changed.transitionDuration) {
      const { transitionDuration } = this.state;
      if ('transitionDuration' in this.$.proxyList) {
        /** @type {any} */ (this.$.proxyList).transitionDuration = transitionDuration;
      }
      if ('transitionDuration' in this.$.stage) {
        /** @type {any} */ (this.$.stage).transitionDuration = transitionDuration;
      }
    }
  }
  get transitionDuration() {
    return this.state.transitionDuration;
  }
  set transitionDuration(transitionDuration) {
    this.setState({ transitionDuration });
  }


}


customElements.define('elix-carousel-slideshow', CarouselSlideshow);
export default CarouselSlideshow;
