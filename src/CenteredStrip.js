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

  get [symbols.defaultState]() {
    return Object.assign(super[symbols.defaultState], {
      orientation: 'horizontal',
      selectionRequired: true
    });
  }

  get orientation() {
    return this[symbols.state].orientation;
  }
  set orientation(orientation) {
    this[symbols.setState]({ orientation });
  }

  [symbols.render](/** @type {PlainObject} */ changed) {
    super[symbols.render](changed);
    if (changed.clientWidth || changed.enableEffects || changed.rightToLeft ||
        changed.selectedIndex || changed.swipeFraction) {
      const { orientation, rightToLeft, selectedIndex } = this[symbols.state];
      const sign = rightToLeft ? 1 : -1;
      const swiping = this[symbols.state].swipeFraction != null;
      const swipeFraction = this[symbols.state].swipeFraction || 0;
      const selectionFraction = selectedIndex + sign * swipeFraction;
  
      const vertical = orientation === 'vertical';
      const leadingEdge = vertical ? 'offsetTop' : 'offsetLeft';
      const dimension = vertical ? 'offsetHeight' : 'offsetWidth';

      // @ts-ignore
      const stripContainerDimension = this[symbols.$].stripContainer[dimension];
      // @ts-ignore
      const stripDimension = this[symbols.$].strip[dimension];
  
      // It seems this method can be invoked before the strip any height/width.
      // We only render if the height/width is positive.
        if (stripDimension > 0) {
        let translation = 0; // The amount by which we'll shift content horizontally
        let justifyContent = '';
        if (stripDimension <= stripContainerDimension) {
          // Container can show all items. Center all items.
          justifyContent = 'center';
        } else {
          // Items are wider than container can show.
          // Center the selected item.
          // During swipes, center a pro-rated point between the midpoints
          // of the items on either side of the fractional selection.
    
          const itemBeforeIndex = Math.floor(selectionFraction);
          const itemBefore = this.items && this.items[itemBeforeIndex];
          const itemBeforeCenter = itemBefore instanceof HTMLElement ?
            itemBefore[leadingEdge] + itemBefore[dimension] / 2 :
            0;
          const itemAfterIndex = itemBeforeIndex + 1;
          const itemAfter = this.items && this.items[itemAfterIndex];
          const itemAfterCenter = itemAfter instanceof HTMLElement ?
            itemAfter[leadingEdge] + itemAfter[dimension] / 2 :
            0;
    
          let center = 0;
          if (itemBefore && !itemAfter) {
            center = itemBeforeCenter;
          } else if (!itemBefore && itemAfter) {
            center = itemAfterCenter;
          } else if (itemBefore && itemAfter) {
            const offsetFraction = selectionFraction - itemBeforeIndex;
            // TODO: sign
            center = itemBeforeCenter + offsetFraction * (itemAfterCenter - itemBeforeCenter);
          }
          if (!vertical && rightToLeft) {
            center = stripDimension - center;
          }
          
          // Try to center the selected item.
          translation = center - (stripContainerDimension / 2);
    
          // Constrain x to avoid showing space on either end.
          translation = Math.max(translation, 0);
          translation = Math.min(translation, stripDimension - stripContainerDimension);
    
          translation *= sign;
        }
    
        const axis = vertical ? 'Y' : 'X';
        const transform = `translate${axis}(${translation}px)`;
        const showTransition = this[symbols.state].enableEffects && !swiping;
        Object.assign(this[symbols.$].strip.style, {
          transform,
          transition: showTransition ? 'transform 0.25s' : 'none'
        });

        this[symbols.$].stripContainer.style.justifyContent = justifyContent;
      }
    }
    if (changed.orientation) {
      const flexDirection = this[symbols.state].orientation === 'horizontal' ?
        '' :
        'column';
      this[symbols.$].stripContainer.style.flexDirection = flexDirection;
      this[symbols.$].strip.style.flexDirection = flexDirection;
    }
  }

  get swipeFraction() {
    return this[symbols.state].swipeFraction;
  }
  set swipeFraction(swipeFraction) {
    this[symbols.setState]({ swipeFraction });
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
