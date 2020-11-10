import { fragmentFrom } from "../core/htmlLiterals.js";
import CrossfadeStage from "./CrossfadeStage.js";
import { defaultState, template } from "./internal.js";
import TimerCursorMixin from "./TimerCursorMixin.js";

const Base = TimerCursorMixin(CrossfadeStage);

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
 * [TimerCursorMixin](TimerCursorMixin).
 *
 * @inherits CrossfadeStage
 * @mixes TimerCursorMixin
 */
class Slideshow extends Base {
  // @ts-ignore
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      cursorOperationsWrap: true,
      cursorTimerDuration: 3000,
      playing: true,
      transitionDuration: 1000,
    });
  }

  get [template]() {
    const result = super[template];

    result.content.append(fragmentFrom.html`
      <style>
        #crossfadeContainer {
          align-items: stretch;
          justify-content: stretch;
        }
      </style>
    `);

    return result;
  }
}

export default Slideshow;
