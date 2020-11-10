import CenteredStrip from "../base/CenteredStrip.js";
import {
  defaultState,
  render,
  setState,
  state,
  template,
} from "../base/internal.js";
import { fragmentFrom } from "../core/htmlLiterals.js";

const opacityMinimum = 0.4;
const opacityMaximum = 1.0;

/**
 * Centered strip showing unselected items with partial opacity
 *
 * [`CenteredStripOpacity` is used by Carousel for dots or
 * thumbnails](/demos/centeredStripOpacity.html)
 *
 * For a variation that uses a highlight color instead of opacity, see
 * [CenteredStripHighlight](CenteredStripHighlight).
 *
 * @inherits CenteredStrip
 */
class PlainCenteredStripOpacity extends CenteredStrip {
  // @ts-ignore
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      transitionDuration: 250,
    });
  }

  [render](/** @type {ChangedFlags} */ changed) {
    super[render](changed);
    if (
      changed.currentIndex ||
      changed.enableEffects ||
      changed.items ||
      changed.rightToLeft ||
      changed.swipeFraction ||
      changed.transitionDuration
    ) {
      // Apply opacity based on which item is current.
      const {
        currentIndex,
        enableEffects,
        items,
        rightToLeft,
        swipeFraction,
        transitionDuration,
      } = this[state];
      if (items) {
        const sign = rightToLeft ? 1 : -1;
        const swiping = swipeFraction != null;
        const selectionFraction = sign * (swipeFraction || 0);
        const showTransition = enableEffects && !swiping;
        const opacityTransitionValue = showTransition
          ? `${transitionDuration / 1000}s linear`
          : null;
        items.forEach((item, index) => {
          const existingTransition = getComputedStyle(item).transition;
          const transition = mergeSinglePropertyTransition(
            existingTransition,
            "opacity",
            opacityTransitionValue
          );
          const opacity = opacityForItemWithIndex(
            index,
            currentIndex,
            selectionFraction
          );
          Object.assign(item.style, {
            opacity,
            transition,
          });
        });
      }
    }
  }

  get [template]() {
    const result = super[template];
    result.content.append(
      fragmentFrom.html`
        <style>
          ::slotted(*) {
            opacity: ${opacityMinimum.toString()};
          }
        </style>
      `
    );
    return result;
  }

  get transitionDuration() {
    return this[state].transitionDuration;
  }
  set transitionDuration(transitionDuration) {
    this[setState]({ transitionDuration });
  }
}

/**
 * @private
 * @param {number} index
 * @param {number} currentIndex
 * @param {number} selectionFraction
 */
function opacityForItemWithIndex(index, currentIndex, selectionFraction) {
  const opacityRange = opacityMaximum - opacityMinimum;
  const fractionalIndex = currentIndex + selectionFraction;
  const leftIndex = Math.floor(fractionalIndex);
  const rightIndex = Math.ceil(fractionalIndex);
  let awayIndex = selectionFraction >= 0 ? leftIndex : rightIndex;
  let towardIndex = selectionFraction >= 0 ? rightIndex : leftIndex;
  const truncatedSwipeFraction =
    selectionFraction < 0
      ? Math.ceil(selectionFraction)
      : Math.floor(selectionFraction);
  const progress = selectionFraction - truncatedSwipeFraction;
  const opacityProgressThroughRange = Math.abs(progress) * opacityRange;

  let opacity;
  if (index === awayIndex) {
    opacity = opacityMaximum - opacityProgressThroughRange;
  } else if (index === towardIndex) {
    opacity = opacityMinimum + opacityProgressThroughRange;
  } else {
    opacity = null; // Element will pick up minimum opacity from CSS.
  }

  return opacity;
}

/**
 * Given an existing CSS `transition` value, merge a transition for the property
 * with the indicated name and value on top of it. If the value is null, remove
 * the transition for the indicated property. Return a new string that can be
 * set as the value of an element's `transition` style property.
 *
 * This helper exists because the DOM represents the entire set of property
 * transitions on an object as a single string, with no easy way to selectively
 * update just a single property value.
 *
 * @private
 * @param {string} transition
 * @param {string} name
 * @param {string|null} value
 */
function mergeSinglePropertyTransition(transition, name, value) {
  // Properties are a name, whitespace, value.
  const propertyRegex = /([\w-]+)\s+([^,]+)/g;
  let match = propertyRegex.exec(transition);
  while (match && match.groups) {
    if (match.groups.name === name) {
      break;
    }
    match = propertyRegex.exec(transition);
  }
  const definition = value ? `${name} ${value}` : "";
  if (match) {
    // Transition contains the indicated property.
    // Splice in a new value at that point.
    const start = match.index;
    const length = match[0].length;
    return (
      transition.substr(0, start) +
      definition +
      transition.substr(start + length)
    );
  } else {
    // Transition doesn't yet contain the indicated property; append it.
    return [transition, definition].join(", ");
  }
}

export default PlainCenteredStripOpacity;
