import { merge } from './updates.js';
import * as symbols from './symbols.js';
import ClickSelectionMixin from './ClickSelectionMixin.js';
import ContentItemsMixin from './ContentItemsMixin.js';
import ElementBase from './ElementBase.js';
import LanguageDirectionMixin from './LanguageDirectionMixin.js';
import SingleSelectionMixin from './SingleSelectionMixin.js';
import SlotContentMixin from './SlotContentMixin.js';


const Base =
  ClickSelectionMixin(
  ContentItemsMixin(
  LanguageDirectionMixin(
  SingleSelectionMixin(
  SlotContentMixin(
    ElementBase
  )))));


class CenteredStrip extends Base {

  componentDidMount() {
    if (super.componentDidMount) { super.componentDidMount(); }
    // Once everything's finished rendering, enable transition effects.
    setTimeout(() => {
      this.setState({
        enableTransitions: true
      });
    });
  }

  get defaultState() {
    // Suppress transition effects on page load.
    return Object.assign({}, super.defaultState, {
      selectionRequired: true,
      enableTransitions: false
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
          position: relative;
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

    const rightToLeft = this[symbols.rightToLeft];

    const sign = rightToLeft ? 1 : -1;
    const swiping = this.state.swipeFraction != null;
    const selectedIndex = this.selectedIndex;
    const swipeFraction = this.state.swipeFraction || 0;
    const selectionFraction = selectedIndex + sign * swipeFraction;

    // @ts-ignore
    const stripContainerWidth = this.$.stripContainer.offsetWidth;
    // @ts-ignore
    const stripWidth = this.$.strip.offsetWidth;

    // HACK: It seems Firefox can invoke this method before it's actually
    // rendered the component and given the strip any width. If we detect that
    // case, we bail out to avoid rendering incorrectly.
    if (stripWidth === 0) {
      return super.updates;
    }

    let translation = 0; // The amount by which we'll shift content horizontally
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
        // TODO: sign
        center = leftCenter + offsetFraction * (rightCenter - leftCenter);
      }
      if (rightToLeft) {
        center = stripWidth - center;
      }
      
      // Try to center the selected item.
      translation = center - (stripContainerWidth / 2);

      // Constrain x to avoid showing space on either end.
      translation = Math.max(translation, 0);
      translation = Math.min(translation, stripWidth - stripContainerWidth);

      translation *= sign;
    }

    const transform = `translateX(${translation}px)`;

    const showTransition = this.state.enableTransitions && !swiping;
    const transition = showTransition ?
      'transform 0.25s' :
      'none';

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
