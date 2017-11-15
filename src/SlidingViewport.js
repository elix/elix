import { merge } from './updates.js';
import * as fractionalSelection from './fractionalSelection.js';
import ContentItemsMixin from './ContentItemsMixin.js';
import ElementBase from './ElementBase.js';
import LanguageDirectionMixin from './LanguageDirectionMixin.js';
import SingleSelectionMixin from './SingleSelectionMixin.js';
import SlotContentMixin from './SlotContentMixin.js';
// @ts-ignore
import Spread from './Spread.js'; // eslint-disable-line no-unused-vars
import symbols from './symbols.js';


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
 * @mixes ContentItemsMixin
 * @mixes LanguageDirectionMixin
 * @mixes SingleSelectionMixin
 * @mixes SlotContentMixin
 */
class SlidingViewport extends Base {

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
    return `
      <style>
        :host {
          overflow: hidden;
          position: relative;
        }

        elix-spread {
          height: 100%;
          will-change: transform;
        }
      </style>
      <elix-spread id="content" role="none">
        <slot></slot>
      </elix-spread>
    `;
  }

  get updates() {
    const sign = this.rightToLeft ? 1 : -1;
    const swiping = this.state.swipeFraction != null;
    const swipeFraction = this.state.swipeFraction || 0;
    const selectionFraction = this.state.selectedIndex + sign * swipeFraction;
    const count = this.items ? this.items.length : 0;
    const dampedSelection = fractionalSelection.dampenListSelection(selectionFraction, count);
    const fraction = sign * dampedSelection / count;
    const transition = swiping ?
      'none' :
      'transform 0.25s';

    return merge(super.updates, {
      $: {
        content: {
          style: {
            'transform': `translateX(${fraction * 100}%)`,
            transition
          }
        }
      }
    });
  }
}


customElements.define('elix-sliding-viewport', SlidingViewport);
export default SlidingViewport;
