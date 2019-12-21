import * as internal from "./internal.js";
import Carousel from "./Carousel.js";
import CrossfadeStage from "./CrossfadeStage.js";
import TimerSelectionMixin from "./TimerSelectionMixin.js";

const Base = TimerSelectionMixin(Carousel);

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
 * @part {CrossfadeStage} stage
 */
class CarouselSlideshow extends Base {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      playing: true,
      selectionTimerDuration: 3000,
      selectionWraps: true,
      stagePartType: CrossfadeStage,
      transitionDuration: 1000
    });
  }

  [internal.render](/** @type {PlainObject} */ changed) {
    super[internal.render](changed);
    if (changed.transitionDuration) {
      const { transitionDuration } = this[internal.state];
      if ("transitionDuration" in this[internal.ids].proxyList) {
        /** @type {any} */ (this[
          internal.ids
        ].proxyList).transitionDuration = transitionDuration;
      }
      if ("transitionDuration" in this[internal.ids].stage) {
        /** @type {any} */ (this[
          internal.ids
        ].stage).transitionDuration = transitionDuration;
      }
    }
  }
  get transitionDuration() {
    return this[internal.state].transitionDuration;
  }
  set transitionDuration(transitionDuration) {
    this[internal.setState]({ transitionDuration });
  }
}

export default CarouselSlideshow;
