import * as internal from './internal.js';
import * as template from './template.js';
import EffectMixin from './EffectMixin.js';
import LanguageDirectionMixin from './LanguageDirectionMixin.js';
import ReactiveElement from './ReactiveElement.js';
import ResizeMixin from './ResizeMixin.js';
import SingleSelectionMixin from './SingleSelectionMixin.js';
import SlotItemsMixin from './SlotItemsMixin.js';
import TapSelectionMixin from './TapSelectionMixin.js';

const Base = EffectMixin(
  LanguageDirectionMixin(
    ResizeMixin(
      SingleSelectionMixin(SlotItemsMixin(TapSelectionMixin(ReactiveElement)))
    )
  )
);

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
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      orientation: 'horizontal',
      selectionRequired: true
    });
  }

  get orientation() {
    return this[internal.state].orientation;
  }
  set orientation(orientation) {
    this[internal.setState]({ orientation });
  }

  [internal.render](/** @type {PlainObject} */ changed) {
    super[internal.render](changed);
    if (
      changed.clientWidth ||
      changed.enableEffects ||
      changed.rightToLeft ||
      changed.selectedIndex ||
      changed.swipeFraction
    ) {
      const { orientation, rightToLeft, selectedIndex } = this[internal.state];
      const sign = rightToLeft ? 1 : -1;
      const swiping = this[internal.state].swipeFraction != null;
      const swipeFraction = this[internal.state].swipeFraction || 0;
      const selectionFraction = selectedIndex + sign * swipeFraction;

      const vertical = orientation === 'vertical';
      const leadingEdge = vertical ? 'offsetTop' : 'offsetLeft';
      const dimension = vertical ? 'offsetHeight' : 'offsetWidth';

      // @ts-ignore
      const stripContainerDimension = this[internal.ids].stripContainer[
        dimension
      ];
      // @ts-ignore
      const stripDimension = this[internal.ids].strip[dimension];

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
          const itemBeforeCenter =
            itemBefore instanceof HTMLElement
              ? itemBefore[leadingEdge] + itemBefore[dimension] / 2
              : 0;
          const itemAfterIndex = itemBeforeIndex + 1;
          const itemAfter = this.items && this.items[itemAfterIndex];
          const itemAfterCenter =
            itemAfter instanceof HTMLElement
              ? itemAfter[leadingEdge] + itemAfter[dimension] / 2
              : 0;

          let center = 0;
          if (itemBefore && !itemAfter) {
            center = itemBeforeCenter;
          } else if (!itemBefore && itemAfter) {
            center = itemAfterCenter;
          } else if (itemBefore && itemAfter) {
            const offsetFraction = selectionFraction - itemBeforeIndex;
            // TODO: sign
            center =
              itemBeforeCenter +
              offsetFraction * (itemAfterCenter - itemBeforeCenter);
          }
          if (!vertical && rightToLeft) {
            center = stripDimension - center;
          }

          // Try to center the selected item.
          translation = center - stripContainerDimension / 2;

          // Constrain x to avoid showing space on either end.
          translation = Math.max(translation, 0);
          translation = Math.min(
            translation,
            stripDimension - stripContainerDimension
          );

          translation *= sign;
        }

        const axis = vertical ? 'Y' : 'X';
        const transform = `translate${axis}(${translation}px)`;
        const showTransition = this[internal.state].enableEffects && !swiping;
        Object.assign(this[internal.ids].strip.style, {
          transform,
          transition: showTransition ? 'transform 0.25s' : 'none'
        });

        this[internal.ids].stripContainer.style.justifyContent = justifyContent;
      }
    }
    if (changed.items || changed.selectedIndex) {
      // Apply `selected` style to the selected item only.
      const { selectedIndex, items } = this[internal.state];
      if (items) {
        items.forEach((item, index) => {
          item.toggleAttribute('selected', index === selectedIndex);
        });
      }
    }
    if (changed.orientation) {
      const flexDirection =
        this[internal.state].orientation === 'horizontal' ? '' : 'column';
      this[internal.ids].stripContainer.style.flexDirection = flexDirection;
      this[internal.ids].strip.style.flexDirection = flexDirection;
    }
  }

  get swipeFraction() {
    return this[internal.state].swipeFraction;
  }
  set swipeFraction(swipeFraction) {
    this[internal.setState]({ swipeFraction });
  }

  get [internal.template]() {
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

export default CenteredStrip;
