import * as internal from "./internal.js";
import CrossfadeStage from "./CrossfadeStage.js";
import TimerSelectionMixin from "./TimerSelectionMixin.js";

const Base = TimerSelectionMixin(CrossfadeStage);

/**
 * Slideshow with a simple crossfade transition
 *
 * [A basic slideshow](/demos/slideshow.html)
 *
 * By default the slideshow will immediately begin playing when it is connected
 * to the document, and then advance every 3 seconds.
 *
 * This component provides no interactivity of its own. For an interactive
 * version, see [SlideshowWithPlayControls](SlideshowWithPlayControls) or
 * [CarouselSlideshow](CarouselSlideshow). To incorporate slideshow behavior
 * into a component of your own, apply
 * [TimerSelectionMixin](TimerSelectionMixin).
 *
 * @inherits CrossfadeStage
 * @mixes TimerSelectionMixin
 */
class Slideshow extends Base {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      playing: true,
      selectionTimerDuration: 3000,
      selectionWraps: true,
      transitionDuration: 1000
    });
  }
}

export default Slideshow;
