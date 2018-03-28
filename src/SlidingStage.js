import { merge } from './updates.js';
import * as fractionalSelection from './fractionalSelection.js';
import * as symbols from './symbols.js';
import ContentItemsMixin from './ContentItemsMixin.js';
import ElementBase from './ElementBase.js';
import LanguageDirectionMixin from './LanguageDirectionMixin.js';
import SingleSelectionMixin from './SingleSelectionMixin.js';
import SlotContentMixin from './SlotContentMixin.js';


const Base =
  ContentItemsMixin(
  LanguageDirectionMixin(
  SingleSelectionMixin(
  SlotContentMixin(
    ElementBase
  ))));


/**
 * Displays a set of items on a horizontal axis, with a single item completely
 * visible at a time. It shows a sliding transition when changing which item is
 * selected.
 * 
 * @inherits ElementBase
 * @mixes ContentItemsMixin
 * @mixes LanguageDirectionMixin
 * @mixes SingleSelectionMixin
 * @mixes SlotContentMixin
 */
class SlidingStage extends Base {

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      orientation: 'horizontal',
      selectionRequired: true
    });
  }

  get swipeFraction() {
    return this.state.swipeFraction;
  }
  set swipeFraction(swipeFraction) {
    const parsed = swipeFraction && parseFloat(swipeFraction);
    this.setState({
      swipeFraction: parsed
    });
  }

  get [symbols.template]() {
    // The trick here is to give the slotted elements a flex-basis of 100%. This
    // makes them each as big as the component, spreading them out equally. The
    // slidingStageContent container will only big as big as the host too, but
    // all the elements slotted inside it will still be visible even if they
    // fall outside its bounds. By translating the container left or right, we
    // can cause any individual slotted item to become the sole visible item.
    return `
      <style>
        :host {
          display: inline-flex;
          overflow: hidden;
          position: relative;
        }

        #slidingStageContent {
          display: flex;
          height: 100%;
          min-width: 100%;
          will-change: transform;
        }

        #slidingStageContent > ::slotted(*) {
          flex: 0 0 100%;
          max-width: 100%; /* For Firefox */
        }

        #slidingStageContent > ::slotted(img) {
          object-fit: contain;
        }
      </style>
      <div id="slidingStageContent" role="none">
        <slot></slot>
      </div>
    `;
  }

  get updates() {
    const sign = this[symbols.rightToLeft] ? 1 : -1;
    const swiping = this.state.swipeFraction != null;
    const swipeFraction = this.state.swipeFraction || 0;
    const selectedIndex = this.state.selectedIndex;
    let translation;
    if (selectedIndex >= 0) {
      const selectionFraction = selectedIndex + sign * swipeFraction;
      const count = this.items ? this.items.length : 0;
      const dampedSelection = fractionalSelection.dampenListSelection(selectionFraction, count);
      translation = sign * dampedSelection * 100;
    } else {
      translation = 0;
    }
    const transition = swiping ?
      'none' :
      'transform 0.25s';

    return merge(super.updates, {
      $: {
        slidingStageContent: {
          style: {
            'transform': `translateX(${translation}%)`,
            transition
          }
        }
      }
    });
  }
}


customElements.define('elix-sliding-stage', SlidingStage);
export default SlidingStage;
