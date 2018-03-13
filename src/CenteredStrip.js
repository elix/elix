import { merge } from './updates.js';
import * as symbols from './symbols.js';
import ClickSelectionMixin from './ClickSelectionMixin.js';
import ContentItemsMixin from './ContentItemsMixin.js';
import ElementBase from './ElementBase.js';
import FocusVisibleMixin from './FocusVisibleMixin.js';
import LanguageDirectionMixin from './LanguageDirectionMixin.js';
import SingleSelectionMixin from './SingleSelectionMixin.js';
import SlotContentMixin from './SlotContentMixin.js';


const Base =
  ClickSelectionMixin(
  ContentItemsMixin(
  FocusVisibleMixin(
  LanguageDirectionMixin(
  SingleSelectionMixin(
  SlotContentMixin(
    ElementBase
  ))))));


class CenteredStrip extends Base {

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      selectionRequired: true
    });
  }

  get orientation() {
    return 'horizontal';
  }

  get swipeFraction() {
    return this.state.swipeFraction;
  }
  set swipeFraction(swipeFraction) {
    this.setState({ swipeFraction });
  }

  get [symbols.template]() {
    return `
      <style>
        :host {
          cursor: default;
          display: flex;
          -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        }

        #stripContainer {
          display: flex;
          flex: 1;
          overflow: hidden;
          position: relative;
        }

        #strip {
          display: inline-flex;
          transition: transform 0.25s;
        }
      </style>
      <div id="stripContainer" role="none">
        <div id="strip" role="none">
          <slot></slot>
        </div>
      </div>
    `;
  }

  get updates() {

    const sign = this[symbols.rightToLeft] ? 1 : -1;
    const swiping = this.state.swipeFraction != null;
    const selectedIndex = this.state.selectedIndex;
    const swipeFraction = this.state.swipeFraction || 0;
    const selectionFraction = selectedIndex + sign * swipeFraction;

    // @ts-ignore
    const stripContainerWidth = this.$.stripContainer.offsetWidth;
    // @ts-ignore
    const stripWidth = this.$.strip.offsetWidth;

    let x = 0; // The amount by which we'll shift content horizontally
    let justifyContent = '';
    if (stripWidth <= stripContainerWidth) {
      // Container can show all items. Center all items.
      justifyContent = 'center';    
    } else {
      // Items are wider than container can show.
      // Center the selected item.
      // During swipes, center a pro-rated point between the midpoints
      // of the items on either side of the fractional selection.

      const leftIndex = Math.floor(selectionFraction);
      const leftItem = this.items && this.items[leftIndex];
      const leftCenter = leftItem instanceof HTMLElement ?
        leftItem.offsetLeft + leftItem.offsetWidth / 2 :
        0;
      const rightIndex = leftIndex + 1;
      const rightItem = this.items && this.items[rightIndex];
      const rightCenter = rightItem instanceof HTMLElement ?
        rightItem.offsetLeft + rightItem.offsetWidth / 2 :
        0;

      let center = 0;
      if (leftItem && !rightItem) {
        center = leftCenter;
      } else if (!leftItem && rightItem) {
        center = rightCenter;
      } else if (leftItem && rightItem) {
        const offsetFraction = selectionFraction - leftIndex;
        center = leftCenter + offsetFraction * (rightCenter - leftCenter);
      }
      
      // Try to center the selected item.
      x = center - (stripContainerWidth / 2);

      // Constrain x to avoid showing space on either end.
      x = Math.max(x, 0);
      x = Math.min(x, stripWidth - stripContainerWidth);
    }

    const transform = `translateX(${-x}px)`;
    const transition = swiping ?
      'none' :
      'transform 0.25s';

    return merge(super.updates, {
      $: {
        strip: {
          style: {
            transform,
            transition
          }
        },
        stripContainer: {
          style: {
            'justify-content': justifyContent
          }
        }
      }
    });
  }

}


customElements.define('elix-centered-strip', CenteredStrip);
export default CenteredStrip;
