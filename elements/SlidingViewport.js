import ContentItemsMixin from '../mixins/ContentItemsMixin.js';
import ElementBase from './ElementBase.js';
import * as FractionalSelection from '../utilities/FractionalSelection.js';
import LanguageDirectionMixin from '../mixins/LanguageDirectionMixin.js';
import * as props from '../mixins/props.js';
import SingleSelectionMixin from '../mixins/SingleSelectionMixin.js';
import SlotContentMixin from '../mixins/SlotContentMixin.js';
import Spread from './Spread.js'; // eslint-disable-line no-unused-vars
import symbols from '../mixins/symbols.js';


const Base =
  ContentItemsMixin(
  LanguageDirectionMixin(
  SingleSelectionMixin(
  SlotContentMixin(
    ElementBase
  ))));


class SlidingViewport extends Base {

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      orientation: 'horizontal',
      selectionRequired: true
    });
  }

  get props() {
    const sign = this.rightToLeft ? -1 : 1;
    const swiping = this.state.swipeFraction != null;
    const swipeFraction = this.state.swipeFraction || 0;
    const fractionalSelection = this.state.selectedIndex + sign * swipeFraction;
    const count = this.items.length;
    const dampedSelection = FractionalSelection.dampedListSelection(fractionalSelection, count);
    const fraction = dampedSelection / count;
    const transition = swiping ?
      'none' :
      'transform 0.25s';
    
    return props.merge(super.props, {
      $: {
        content: {
          style: {
            'transform': `translateX(${-sign * fraction * 100}%)`,
            transition
          }
        }
      }
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
}


customElements.define('elix-sliding-viewport', SlidingViewport);
export default SlidingViewport;
