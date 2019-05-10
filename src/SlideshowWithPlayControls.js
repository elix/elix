import * as symbols from './symbols.js';
import AriaListMixin from './AriaListMixin.js';
import DirectionSelectionMixin from './DirectionSelectionMixin.js';
import FocusVisibleMixin from './FocusVisibleMixin.js';
import KeyboardDirectionMixin from './KeyboardDirectionMixin.js';
import KeyboardMixin from './KeyboardMixin.js';
import LanguageDirectionMixin from './LanguageDirectionMixin.js';
import PlayControlsMixin from './PlayControlsMixin.js';
import Slideshow from './Slideshow.js';
import SwipeDirectionMixin from './SwipeDirectionMixin.js';
import TouchSwipeMixin from './TouchSwipeMixin.js';
import TrackpadSwipeMixin from './TrackpadSwipeMixin.js';


const Base =
  AriaListMixin(
  DirectionSelectionMixin(
  FocusVisibleMixin(
  KeyboardDirectionMixin(
  KeyboardMixin(
  LanguageDirectionMixin(
  PlayControlsMixin(
  SwipeDirectionMixin(
  TouchSwipeMixin(
  TrackpadSwipeMixin(
    Slideshow
  ))))))))));


/**
 * Slideshow with buttons for controlling playback
 * 
 * [Play controls let the user go back, pause/resume, or forward](/demos/slideshowWithPlayControls.html)
 * 
 * This component is simply a [Slideshow](./Slideshow) that uses
 * [PlayControlsMixin](PlayControlsMixin) to add buttons for controlling
 * slideshow playback.
 * 
 * For a variation that uses standard carousel controls (arrows and page dots),
 * see [CarouselSlideshow](CarouselSlideshow). For a more basic variation with
 * no controls, see [Slideshow](Slideshow).
 * 
 * @inherits Slideshow
 * @mixes AriaListMixin
 * @mixes DirectionSelectionMixin
 * @mixes FocusVisibleMixin
 * @mixes KeyboardDirectionMixin
 * @mixes KeyboardMixin
 * @mixes LanguageDirectionMixin
 * @mixes PlayControlsMixin
 * @mixes SwipeDirectionMixin
 * @mixes TouchSwipeMixin
 * @mixes TrackpadSwipeMixin
 */
class SlideshowWithPlayControls extends Base {

  componentDidMount() {
    super.componentDidMount();

    // Clicking the slideshow toggles the playing state.
    this.addEventListener('click', () => {
      this[symbols.raiseChangeEvents] = true;
      this.playing = !this.playing;
      this[symbols.raiseChangeEvents] = false;
    });
  }

  get [symbols.template]() {
    const result = super[symbols.template];
    const modesContainer = result.content.querySelector('#modesContainer');
    this[PlayControlsMixin.wrap](modesContainer);
    return result;
  }

}


customElements.define('elix-slideshow-with-play-controls', SlideshowWithPlayControls);
export default SlideshowWithPlayControls;
