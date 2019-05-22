import * as symbols from './symbols.js';
import * as template from './template.js';
import EffectMixin from './EffectMixin.js';
import LanguageDirectionMixin from './LanguageDirectionMixin.js';
import ReactiveElement from './ReactiveElement.js';
import ResizeMixin from './ResizeMixin.js';
import SingleSelectionMixin from './SingleSelectionMixin.js';
import SlotItemsMixin from './SlotItemsMixin.js';
import TapSelectionMixin from './TapSelectionMixin.js';


const Base =
  EffectMixin(
  LanguageDirectionMixin(
  ResizeMixin(
  SingleSelectionMixin(
  SlotItemsMixin(
  TapSelectionMixin(
    ReactiveElement
  ))))));


/**
 * Horizontal strip of items with the selected item centered
 * 
 * This keeps the selected item centered unless that item is at either end of
 * the list.
 * 
 * @inherits ReactiveElement
 * @mixes EffectMixin
 * @mixes LanguageDirectionMixin
 * @mixes ResizeMixin
 * @mixes SingleSelectionMixin
 * @mixes SlotItemsMixin
 * @mixes TapSelectionMixin
 */
class CenteredStrip extends Base {

  get defaultState() {
    return Object.assign(super.defaultState, {
      selectionRequired: true
    });
  }

  get orientation() {
    return 'horizontal';
  }

  [symbols.render](changed) {
    super[symbols.render](changed);
    if (changed.clientWidth || changed.enableEffects || changed.rightToLeft ||
        changed.selectedIndex || changed.swipeFraction) {
      const rightToLeft = this.state.rightToLeft;
      const sign = rightToLeft ? 1 : -1;
      const swiping = this.state.swipeFraction != null;
      const selectedIndex = this.state.selectedIndex;
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
        return;
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
  
      const showTransition = this.state.enableEffects && !swiping;
      Object.assign(this.$.strip.style, {
        transform: `translateX(${translation}px)`,
        transition: showTransition ? 'transform 0.25s' : 'none'
      });

      this.$.stripContainer.style.justifyContent = justifyContent;
    }
  }

  get swipeFraction() {
    return this.state.swipeFraction;
  }
  set swipeFraction(swipeFraction) {
    this.setState({ swipeFraction });
  }

  get [symbols.template]() {
    return template.html`
      <style>
        :host {
          cursor: default;
          display: flex;
          -webkit-tap-highlight-color: transparent;
          -moz-user-select: none;
          -ms-user-select: none;
          -webkit-user-select: none;
          user-select: none;
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

}


customElements.define('elix-centered-strip', CenteredStrip);
export default CenteredStrip;
