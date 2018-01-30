import './SlidingViewport.js';
import { merge } from './updates.js';
import * as symbols from './symbols.js';
import AriaListMixin from './AriaListMixin.js';
import ArrowDirectionMixin from './ArrowDirectionMixin.js';
import ContentItemsMixin from './ContentItemsMixin.js';
import DirectionSelectionMixin from './DirectionSelectionMixin.js';
import ElementBase from './ElementBase.js';
import FocusVisibleMixin from './FocusVisibleMixin.js';
import KeyboardDirectionMixin from './KeyboardDirectionMixin.js';
import KeyboardMixin from './KeyboardMixin.js';
import LanguageDirectionMixin from './LanguageDirectionMixin.js';
import PageDotsMixin from './PageDotsMixin.js';
import SingleSelectionMixin from './SingleSelectionMixin.js';
import SlotContentMixin from './SlotContentMixin.js';
import SwipeDirectionMixin from './SwipeDirectionMixin.js';
import TouchSwipeMixin from './TouchSwipeMixin.js';
import TrackpadSwipeMixin from './TrackpadSwipeMixin.js';


const Base =
  AriaListMixin(
  ArrowDirectionMixin(
  ContentItemsMixin(
  DirectionSelectionMixin(
  FocusVisibleMixin(
  KeyboardDirectionMixin(
  KeyboardMixin(
  LanguageDirectionMixin(
  PageDotsMixin(
  SingleSelectionMixin(
  SlotContentMixin(
  SwipeDirectionMixin(
  TouchSwipeMixin(
  TrackpadSwipeMixin(
    ElementBase
  ))))))))))))));

/**
 * A typical carousel with a sliding effect. The user can move between items with
 * touch, the mouse, the keyboard, or a trackpad.
 * 
 * This carousel lets the user navigate the selection with left/right arrow
 * buttons provided by [ArrowDirectionMixin](ArrowDirectionMixin) and small dots
 * at the bottom of the carousel provided by [PageDotsMixin](PageDotsMixin). For
 * a plain carousel without those extras, see [SlidingPages](SlidingPages).
 * 
 * @inherits ElementBase
 * @mixes AriaListMixin
 * @mixes ArrowDirectionMixin
 * @mixes ContentItemsMixin
 * @mixes DirectionSelectionMixin
 * @mixes FocusVisibleMixin
 * @mixes KeyboardDirectionMixin
 * @mixes KeyboardMixin
 * @mixes LanguageDirectionMixin
 * @mixes PageDotsMixin
 * @mixes SingleSelectionMixin
 * @mixes SlotContentMixin
 * @mixes SwipeDirectionMixin
 * @mixes TouchSwipeMixin
 * @mixes TrackpadSwipeMixin
 */
class SlidingCarousel extends Base {

  componentDidMount() {
    if (super.componentDidMount) { super.componentDidMount(); }
    this.$.viewport.addEventListener('selected-index-changed', () => {
      /** @type {any} */
      const viewport = this.$.viewport;
      this.selectedIndex = viewport.selectedIndex;
    });
  }

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      selectionRequired: true
    });
  }

  get [symbols.template]() {
    return `
      <style>
        :host {
          display: flex;
          overflow: hidden;
          position: relative;
        }

        elix-sliding-viewport {
          flex: 1;
        }
      </style>
      ${ArrowDirectionMixin.wrap(this,
        PageDotsMixin.wrap(`
          <elix-sliding-viewport id="viewport">
            <slot></slot>
          </elix-sliding-viewport>
        `)
      )}
    `;
  }

  get updates() {
    return merge(super.updates, {
      $: {
        viewport: {
          selectedIndex: this.state.selectedIndex,
          swipeFraction: this.state.swipeFraction
        }
      }
    });
  }
}


customElements.define('elix-sliding-carousel', SlidingCarousel);
export default SlidingCarousel;
