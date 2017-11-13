import { merge } from './updates.js';
import AriaListMixin from './AriaListMixin.js';
import ArrowSelectionMixin from './ArrowSelectionMixin.js';
import ContentItemsMixin from './ContentItemsMixin.js';
import DirectionSelectionMixin from './DirectionSelectionMixin.js';
import ElementBase from './ElementBase.js';
import FocusRingMixin from './FocusRingMixin.js';
import KeyboardDirectionMixin from './KeyboardDirectionMixin.js';
import KeyboardMixin from './KeyboardMixin.js';
import LanguageDirectionMixin from './LanguageDirectionMixin.js';
import PageDotsMixin from './PageDotsMixin.js';
import SingleSelectionMixin from './SingleSelectionMixin.js';
import SlotContentMixin from './SlotContentMixin.js';
// @ts-ignore
import SlidingViewport from './SlidingViewport.js'; // eslint-disable-line no-unused-vars
import SwipeDirectionMixin from './SwipeDirectionMixin.js';
import symbols from './symbols.js';
import TouchSwipeMixin from './TouchSwipeMixin.js';
import TrackpadSwipeMixin from './TrackpadSwipeMixin.js';


const Base =
  AriaListMixin(
  ArrowSelectionMixin(
  ContentItemsMixin(
  DirectionSelectionMixin(
  FocusRingMixin(
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
      orientation: 'horizontal',
      selectionRequired: true
    });
  }

  get [symbols.template]() {
    return `
      <style>
        :host {
          display: flex;
        }

        elix-sliding-viewport {
          flex: 1;
        }
      </style>
      ${this.wrapWithArrowSelection(
        this.wrapWithPageDots(`
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
