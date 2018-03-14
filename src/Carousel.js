import './CenteredStripOpacity.js';
import './SlidingViewport.js';
import './Thumbnail.js';
import { merge } from './updates.js';
import * as symbols from './symbols.js';
import ArrowDirectionMixin from './ArrowDirectionMixin.js';
import DirectionSelectionMixin from './DirectionSelectionMixin.js';
import Explorer from './Explorer.js';
import FocusVisibleMixin from './FocusVisibleMixin.js';
import KeyboardDirectionMixin from './KeyboardDirectionMixin.js';
import KeyboardMixin from './KeyboardMixin.js';
import SwipeDirectionMixin from './SwipeDirectionMixin.js';
import TouchSwipeMixin from './TouchSwipeMixin.js';
import TrackpadSwipeMixin from './TrackpadSwipeMixin.js';


const arrowButtonTagKey = Symbol('arrowButtonTag');


const Base =
  ArrowDirectionMixin(
  DirectionSelectionMixin(
  FocusVisibleMixin(
  KeyboardDirectionMixin(
  KeyboardMixin(
  SwipeDirectionMixin(
  TouchSwipeMixin(
  TrackpadSwipeMixin(
    Explorer
  ))))))));


/**
 * Allows a user to navigate a horizontal set of items with touch, mouse,
 * keyboard, or trackpad. Shows a sliding effect when moving between items.
 * 
 * @inherits SlidingViewport
 * @mixes DirectionSelectionMixin
 * @mixes FocusVisibleMixin
 * @mixes KeyboardDirectionMixin
 * @mixes KeyboardMixin
 * @mixes SwipeDirectionMixin
 * @mixes TouchSwipeMixin
 * @mixes TrackpadSwipeMixin
 */
class Carousel extends Base {

  get defaults() {
    const base = super.defaults || {};
    return Object.assign({}, base, {
      tags: Object.assign({}, base.tags, {
        list: 'elix-centered-strip-opacity',
        proxy: 'custom-thumbnail',
        stage: 'elix-sliding-viewport'
      })
    });
  }
  
  get defaultState() {
    // Show arrow buttons if device has a fine-grained pointer (e.g., mouse).
    const showArrowButtons = window.matchMedia('(pointer:fine)').matches;
    return Object.assign({}, super.defaultState, {
      listPosition: 'bottom',
      orientation: 'horizontal',
      showArrowButtons
    });
  }

  get stageTemplate() {
    return this[ArrowDirectionMixin.inject](super.stageTemplate);
  }

  get [symbols.swipeTarget]() {
    /** @type {any} */
    const element = this.$.stage;
    return element;
  }

  get updates() {
    return merge(super.updates, {
      $: {
        stage: {
          attributes: {
            tabindex: ''
          }
        }
      }
    });
  }

}


customElements.define('elix-carousel', Carousel);
export default Carousel;
