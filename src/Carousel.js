import './CenteredStripOpacity.js';
import './PageDot.js';
import './SlidingStage.js';
import { merge } from './updates.js';
import * as symbols from './symbols.js';
import AriaListMixin from './AriaListMixin.js';
import ArrowDirectionMixin from './ArrowDirectionMixin.js';
import DirectionSelectionMixin from './DirectionSelectionMixin.js';
import Explorer from './Explorer.js';
import FocusVisibleMixin from './FocusVisibleMixin.js';
import KeyboardDirectionMixin from './KeyboardDirectionMixin.js';
import KeyboardMixin from './KeyboardMixin.js';
import LanguageDirectionMixin from './LanguageDirectionMixin.js';
import SwipeDirectionMixin from './SwipeDirectionMixin.js';
import TouchSwipeMixin from './TouchSwipeMixin.js';
import TrackpadSwipeMixin from './TrackpadSwipeMixin.js';


const Base =
  AriaListMixin(
  ArrowDirectionMixin(
  DirectionSelectionMixin(
  FocusVisibleMixin(
  KeyboardDirectionMixin(
  KeyboardMixin(
  LanguageDirectionMixin(
  SwipeDirectionMixin(
  TouchSwipeMixin(
  TrackpadSwipeMixin(
    Explorer
  ))))))))));


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
        proxy: 'elix-page-dot',
        stage: 'elix-sliding-stage'
      })
    });
  }
  
  get defaultState() {
    // Show arrow buttons if device has a fine-grained pointer (e.g., mouse).
    // As of Mar 14 2018, Firefox does not yet support pointer queries, in which
    // case we assume use of a mouse.
    const pointerQuery = '(pointer: fine)';
    const mediaQueryList = window.matchMedia(pointerQuery);
    const showArrowButtons = mediaQueryList.media === pointerQuery ?
      mediaQueryList.matches :
      true;
    return Object.assign({}, super.defaultState, {
      listPosition: 'bottom',
      listOverlap: true,
      orientation: 'horizontal',
      showArrowButtons
    });
  }

  get stageTemplate() {
    return this[ArrowDirectionMixin.inject](super.stageTemplate);
  }

  get [symbols.swipeTarget]() {
    return this.$.stage instanceof HTMLElement ?
      this.$.stage :
      super[symbols.swipeTarget];
  }

  get updates() {
    return merge(super.updates, {
      $: {
        list: {
          attributes: {
            tabindex: ''
          }
        },
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
