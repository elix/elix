import CrossfadeStage from './CrossfadeStage.js';
import TimerSelectionMixin from './TimerSelectionMixin.js';


const Base =
  TimerSelectionMixin(
    CrossfadeStage
  );


/**
 * Slideshow with a simple crossfade transition.
 *
 * By default the slideshow will immediately begin playing when it is connected
 * to the document and advance every 3 seconds.
 *
 * This component can be used as is. To incorporate slideshow behavior into
 * a component of your own, apply
 * [TimerSelectionMixin](TimerSelectionMixin).
 * 
 * @inherits CrossfadeStage
 * @mixes TimerSelectionMixin
 */
class Slideshow extends Base {

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      playing: true,
      selectionTimerDuration: 3000,
      selectionWraps: true,
      transitionDuration: 1000
    });
  }

}


customElements.define('elix-slideshow', Slideshow);
export default Slideshow;
