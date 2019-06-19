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

  componentDidMount() {
    super.componentDidMount();
    this.addEventListener('transitionend', event => {
      if (this.state.pendingCommand) {
        this.completePendingCommand();
      }
      this.setState({
        pendingCommand: null,
        swipeItem: null
      });
    });
  }

  componentDidUpdate(changed) {
    super.componentDidUpdate(changed);
    if (changed.swipeWillCommitLeft || changed.swipeWillCommitRight) {
      if ('vibrate' in navigator) {
        navigator.vibrate(5);
      }
    }
  }

  get defaultState() {
    const result = Object.assign(super.defaultState, {
      pendingCommand: null,
      swipeWillCommitLeft: false,
      swipeWillCommitRight: false
    });

    // If the swipeFraction crosses the -0.5 or 0.5 mark, update our notion
    // of whether we'll commit an operation if the swipe were to finish at
    // that point.
    result.onChange('swipeFraction', state => {
      const { swipeFraction } = state;
      if (swipeFraction === null) {
        return {
          swipeWillCommitLeft: false,
          swipeWillCommitRight: false
        }
      } else {
        return {
          swipeWillCommitLeft: swipeFraction >= 0.5,
          swipeWillCommitRight: swipeFraction <= -0.5
        };
      }
    });

    // When a swipe starts, determine which item is being swiped. The item will
    // be cleared when the swipe effect's transitionend event is raised
    // (regardless of whether a command was triggered or not).
    result.onChange('swipeStartY', state => {
      const { swipeStartY } = state;
      if (swipeStartY !== null) {
        return {
          swipeItem: getItemAtY(state.items, state.swipeStartY)
        };
      }
      return null;
    });

    return result;
  }
  
  [symbols.render](/** @type {PlainObject} */ changed) {
    super[symbols.render](changed);
    if (changed.enableEffects || changed.swipeItem || changed.swipeFraction) {
      const { swipeItem } = this.state;
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
  }

  [symbols.swipeLeft]() {
    this.setState({
      pendingCommand: 'delete'
    });
  }

  get [symbols.template]() {
    return template.concat(super[symbols.template], template.html`
      <style>
        :host {
          position: relative;
        }

        ::slotted(*) {
          will-change: transform;
        }

        ::slotted(.unread) {
          font-weight: bold;
        }

        .commandContainer {
          display: flex;
          overflow: hidden;
          position: absolute;
          width: 0;
          will-change: width;
        }

        .commandContainer ::slotted(*),
        .commandContainer slot > * {
          flex: 1;
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
function getItemAtY(items, y) {
  return items.find(item => {
    const itemRect = item.getBoundingClientRect();
    return itemRect.top <= y && y <= itemRect.bottom;
  });
}


customElements.define('elix-swipeable-list-box', SwipeableListBox);
export default SwipeableListBox;
