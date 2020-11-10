import Carousel from "./Carousel.js";
import CrossfadeStage from "./CrossfadeStage.js";
import { defaultState, ids, render, setState, state } from "./internal.js";
import TimerCursorMixin from "./TimerCursorMixin.js";

const Base = TimerCursorMixin(Carousel);

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
 * @mixes TimerCursorMixin
 * @part {CrossfadeStage} stage
 */
class CarouselSlideshow extends Base {
  // @ts-ignore
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      cursorOperationsWrap: true,
      cursorTimerDuration: 3000,
      playing: true,
      stagePartType: CrossfadeStage,
      transitionDuration: 1000,
    });
  }

  [render](/** @type {ChangedFlags} */ changed) {
    super[render](changed);
    if (changed.transitionDuration) {
      const { transitionDuration } = this[state];
      if ("transitionDuration" in this[ids].proxyList) {
        /** @type {any} */ (this[ids]
          .proxyList).transitionDuration = transitionDuration;
      }
      if ("transitionDuration" in this[ids].stage) {
        /** @type {any} */ (this[ids]
          .stage).transitionDuration = transitionDuration;
      }
    }
  }
  get transitionDuration() {
    return this[state].transitionDuration;
  }
  set transitionDuration(transitionDuration) {
    this[setState]({ transitionDuration });
  }
}

export default CarouselSlideshow;
