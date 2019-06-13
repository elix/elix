import * as symbols from './symbols.js';
import * as template from './template.js';
import EffectMixin from './EffectMixin.js';
import ListBox from './ListBox.js';
import TrackpadSwipeMixin from './TrackpadSwipeMixin.js';
import TouchSwipeMixin from './TouchSwipeMixin.js';


const Base =
  EffectMixin(
  TouchSwipeMixin(
  TrackpadSwipeMixin(
    ListBox
  )));


/**
 * List that allows a user to swipe items, e.g., to reveal commands.
 */
class SwipeableListBox extends Base {

  constructor() {
    super();
    this.addEventListener('wheel', async (event) => {
      if (event.target instanceof Node) {
        swipeItemAtY(this, event.y);
      }
    });
    // See TouchSwipeMixin for reasoning about touch/pointer events.
    if ('TouchEvent' in window) {
      // Use touch events.
      this.addEventListener('touchstart', async (event) => {
        swipeItemAtY(this, event.changedTouches[0].clientY);
      });
    } else {
      // Use pointer events.
      this.addEventListener('pointerdown', async (event) => {
        swipeItemAtY(this, event.clientY);
      });
    }
  }

  get defaultState() {
    const result = Object.assign(super.defaultState, {
      swipeWillCommitLeft: false,
      swipeWillCommitRight: false
    });

    // If the swipeFraction crosses the -0.5 or 0.5 mark, update our notion
    // of whether we'll commit an operation if the swipe were to finish at
    // that point.
    result.onChange('swipeFraction', state => {
      return {
        swipeWillCommitLeft: state.swipeFraction >= 0.5,
        swipeWillCommitRight: state.swipeFraction <= -0.5
      };
    });

    return result;
  }

  [symbols.render](/** @type {PlainObject} */ changed) {
    super[symbols.render](changed);
    if (changed.enableEffects || changed.swipeItemIndex || changed.swipeFraction) {
      const swipeItem = getSwipeItemInState(this.state);
      if (swipeItem) {
        const { leftContainer, rightContainer } = this.$;

        const swiping = this.state.swipeFraction != null;
        const swipeFraction = this.state.swipeFraction || 0;
        const showTransition = this.state.enableEffects && !swiping;

        const translation = swipeItem ?
          swipeFraction * 100 :
          0;
        const {
          offsetHeight,
          offsetTop,
          offsetWidth
        } = swipeItem;

        let itemTop = offsetTop;
        const scrollTarget = this[symbols.scrollTarget];
        if (scrollTarget) {
          itemTop -= scrollTarget.scrollTop;
        }

        const commandWidth = Math.min(Math.abs(swipeFraction), 1) * offsetWidth;

        rightContainer.style.transition = showTransition ? 'width 0.25s' : '';
        if (swipeFraction < 0) {
          // Swiping left
          Object.assign(rightContainer.style, {
            height: `${offsetHeight}px`,
            top: `${itemTop}px`,
            width: `${commandWidth}px`
          });
        } else {
          rightContainer.style.width = '0';
        }

        leftContainer.style.transition = showTransition ? 'width 0.25s' : '';
        if (swipeFraction > 0) {
          // Swiping right
          Object.assign(leftContainer.style, {
            height: `${offsetHeight}px`,
            top: `${itemTop}px`,
            width: `${commandWidth}px`
          });
        } else {
          leftContainer.style.width = '0';
        }

        const transform = `translateX(${translation}%)`;
        const transition = showTransition ? 'transform 0.25s' : '';
        Object.assign(swipeItem.style, {
          transform,
          transition 
        });
      }
    }
    if (changed.swipeWillCommitLeft) {
      toggleWillCommit(
        this.$.leftCommandSlot,
        this.state.swipeWillCommitLeft
      );
    }
    if (changed.swipeWillCommitRight) {
      toggleWillCommit(
        this.$.rightCommandSlot,
        this.state.swipeWillCommitRight
      );
    }
  }

  [symbols.swipeLeft]() {
    const swipeItem = getSwipeItemInState(this.state);
    if (swipeItem) {
      swipeItem.remove();
      this.setState({
        swipeItem: null
      });
    }
  }

  [symbols.swipeRight]() {
    const swipeItem = getSwipeItemInState(this.state);
    if (swipeItem) {
      swipeItem.classList.toggle('unread');
    }
  }

  get [symbols.template]() {
    return template.concat(super[symbols.template], template.html`
      <style>
        :host {
          position: relative;
        }

        ::slotted(*) {
          line-height: 1.2em; /* Stabilizes height when line turns bold */
          will-change: transform;
        }

        ::slotted(.unread) {
          font-weight: bold;
        }

        .commandContainer {
          overflow: hidden;
          position: absolute;
          width: 0;
          will-change: width;
        }

        #leftContainer {
          left: 0;
        }

        #rightContainer {
          right: 0;
        }
      </style>
      <div id="leftContainer" class="commandContainer">
        <slot id="leftCommandSlot" name="leftCommand"></slot>
      </div>
      <div id="rightContainer" class="commandContainer">
        <slot id="rightCommandSlot" name="rightCommand"></slot>
      </div>
    `);
  }

}


/**
 * Return the index of the item spanning the indicated y coordinate, or -1 if
 * not found.
 * 
 * @private
 * @param {ListItemElement[]} items
 * @param {number} y
 */
function getIndexOfItemAtY(items, y) {
  return items.findIndex(item => {
    const itemRect = item.getBoundingClientRect();
    return itemRect.top <= y && y <= itemRect.bottom;
  });
}


function getSwipeItemInState(state) {
  return state.items ?
    state.items[state.swipeItemIndex] :
    null;
}


function swipeItemAtY(element, y) {
  const swipeItemIndex = getIndexOfItemAtY(element.state.items, y);
  if (swipeItemIndex) {
    element.setState({
      swipeItemIndex
    });
  }
}


function toggleWillCommit(slot, toggle) {
  slot.assignedElements({ flatten: true }).forEach(element => {
    element.classList.toggle('willCommit', toggle);
  });
}


customElements.define('elix-swipeable-list-box', SwipeableListBox);
export default SwipeableListBox;
