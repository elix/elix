import ArrowSelectionMixin from '../mixins/ArrowSelectionMixin.js';
import ContentItemsMixin from '../mixins/ContentItemsMixin.js';
import DirectionSelectionMixin from '../mixins/DirectionSelectionMixin.js';
import ElementBase from './ElementBase.js';
import FocusRingMixin from '../mixins/FocusRingMixin.js';
import KeyboardDirectionMixin from '../mixins/KeyboardDirectionMixin.js';
import KeyboardMixin from '../mixins/KeyboardMixin.js';
import LanguageDirectionMixin from '../mixins/LanguageDirectionMixin.js';
import * as props from '../mixins/props.js';
import PageDotsMixin from '../mixins/PageDotsMixin.js';
import SelectionAriaMixin from '../mixins/SelectionAriaMixin.js';
import SingleSelectionMixin from '../mixins/SingleSelectionMixin.js';
import SlotContentMixin from '../mixins/SlotContentMixin.js';
// @ts-ignore
import SlidingViewport from './SlidingViewport.js'; // eslint-disable-line no-unused-vars
import SwipeDirectionMixin from '../mixins/SwipeDirectionMixin.js';
import symbols from '../mixins/symbols.js';
import TouchSwipeMixin from '../mixins/TouchSwipeMixin.js';
import TrackpadSwipeMixin from '../mixins/TrackpadSwipeMixin.js';


const Base =
  ArrowSelectionMixin(
  ContentItemsMixin(
  DirectionSelectionMixin(
  FocusRingMixin(
  KeyboardDirectionMixin(
  KeyboardMixin(
  LanguageDirectionMixin(
  PageDotsMixin(
  SelectionAriaMixin(
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
      this.selectedIndex = this.$.viewport.selectedIndex;
    });
  }

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      orientation: 'horizontal',
      selectionRequired: true
    });
  }

  get props() {
    return props.merge(super.props, {
      $: {
        viewport: {
          selectedIndex: this.state.selectedIndex,
          swipeFraction: this.state.swipeFraction
        }
      }
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
}


customElements.define('elix-sliding-carousel', SlidingCarousel);
export default SlidingCarousel;
