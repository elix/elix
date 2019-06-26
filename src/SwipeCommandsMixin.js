import * as symbols from './symbols.js';
import * as template from './template.js';
import ReactiveElement from './ReactiveElement.js'; // eslint-disable-line no-unused-vars


/**
 * Adds template elements for a list box that exposes commands that act on
 * list items when the user swipes to the left or right.
 * 
 * @module SwipeCommandsMixin
 * @param {Constructor<ReactiveElement>} Base
 */
export default function SwipeCommandsMixin(Base) {

  // The class prototype added by the mixin.
  return class SwipeCommands extends Base {

    componentDidMount() {
      if (super.componentDidMount) { super.componentDidMount(); }
      // When a transition on the left/right command container ends, let the
      // component know so that it can perform any operation that should follow
      // the end of the transition. E.g., a Delete swipe command would want to
      // wait until the transition has finished before removing the item.
      this.$.leftContainer.addEventListener('transitionend', () => {
        if (this.state.swipeRightWillCommit && this[symbols.swipeRightComplete]) {
          this[symbols.swipeRightComplete]();
        }
        // Now that the swipe has finished, reset remaining swipe-related state.
        this.setState({
          swipeItem: null,
          swipeRightWillCommit: false
        });
      });
      this.$.rightContainer.addEventListener('transitionend', () => {
        if (this.state.swipeLeftWillCommit && this[symbols.swipeLeftComplete]) {
          this[symbols.swipeLeftComplete]();
        }
        // Now that the swipe has finished, reset remaining swipe-related state.
        this.setState({
          swipeItem: null,
          swipeLeftWillCommit: false
        });
      });
    }

    componentDidUpdate(changed) {
      super.componentDidUpdate(changed);
      // Vibrate if the user is currently swiping and has just triggered a change
      // in the commit-ability of a command.
      if ((changed.swipeLeftWillCommit || changed.swipeRightWillCommit) &&
          'vibrate' in navigator &&
          this.state.swipeFraction !== null) {
        navigator.vibrate(5);
      }
    }

    get defaultState() {
      const result = Object.assign(super.defaultState, {
        swipeLeftFollowsThrough: false,
        swipeLeftRemovesItem: false,
        swipeLeftWillCommit: false,
        swipeRightFollowsThrough: false,
        swipeRightRemovesItem: false,
        swipeRightWillCommit: false
      });

      // If the swipeFraction crosses the -0.5 or 0.5 mark, update our notion
      // of whether we'll commit an operation if the swipe were to finish at
      // that point.
      result.onChange('swipeFraction', state => {
        const { swipeFraction } = state;
        if (swipeFraction !== null) {
          return {
            swipeLeftWillCommit: swipeFraction <= -0.5,
            swipeRightWillCommit: swipeFraction >= 0.5
          };
        }
        return null;
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
        const { swipeItem, swipeFraction } = this.state;
        const { leftContainer, rightContainer } = this.$;
        if (swipeItem) {
          const swiping = swipeFraction !== null;
          if (swiping) {
            // Currently swiping left/right on an item.
            const translation = swipeFraction * 100;

            // Get client rect of item using getBoundingClientRect so that we
            // get more precise fractional dimensions.
            const itemRect = swipeItem.getBoundingClientRect();

            let itemTop = itemRect.top;
            const scrollTarget = this[symbols.scrollTarget];
            if (scrollTarget) {
              itemTop -= scrollTarget.scrollTop;
            }

            const commandWidth = Math.min(Math.abs(swipeFraction), 1) * itemRect.width;

            rightContainer.style.transition = '';
            if (swipeFraction < 0) {
              // Swiping left: show right command container.
              Object.assign(rightContainer.style, {
                height: `${itemRect.height}px`,
                top: `${itemTop}px`,
                width: `${commandWidth}px`
              });
            } else {
              rightContainer.style.width = '0';
            }

            leftContainer.style.transition = '';
            if (swipeFraction > 0) {
              // Swiping right: show left command container.
              Object.assign(leftContainer.style, {
                height: `${itemRect.height}px`,
                top: `${itemTop}px`,
                width: `${commandWidth}px`
              });
            } else {
              leftContainer.style.width = '0';
            }

            Object.assign(swipeItem.style, {
              height: `${itemRect.height}px`,
              transform: `translateX(${translation}%)`,
              transition: ''
            });
          } else {
            // Finished swiping, swiped item is still active. Either let item and
            // command containers reset to normal state, or (if requested,
            // typically for a delete command) let them follow through.
            const {
              swipeLeftFollowsThrough,
              swipeLeftRemovesItem,
              swipeLeftWillCommit,
              swipeRightFollowsThrough,
              swipeRightRemovesItem,
              swipeRightWillCommit
            } = this.state;
            const followThroughLeft = swipeLeftWillCommit && swipeLeftFollowsThrough;
            const followThroughRight = swipeRightWillCommit && swipeRightFollowsThrough;
            const containerTransition = 'height 0.25s, width 0.25s';
            Object.assign(leftContainer.style, {
              transition: containerTransition,
              width: followThroughRight ? '100%' : '0'
            });
            Object.assign(rightContainer.style, {
              transition: containerTransition,
              width: followThroughLeft ? '100%' : '0'
            });
            const translation = followThroughLeft ?
              '-100%' :
              followThroughRight ?
                '100%' :
                '0';
            if (swipeLeftWillCommit && swipeLeftRemovesItem) {
              rightContainer.style.height = '0';
            }
            if (swipeRightWillCommit && swipeRightRemovesItem) {
              leftContainer.style.height = '0';
            }
            const height = (swipeLeftWillCommit && swipeLeftRemovesItem) ||
              (swipeRightWillCommit && swipeRightRemovesItem) ?
              '0' :
              '';
            Object.assign(swipeItem.style, {
              height,
              transform: `translateX(${translation})`,
              transition: 'height 0.25s, transform 0.25s'
            });
          }
        } else {
          // No item is being swiped. Reset command containers.
          Object.assign(leftContainer.style, {
            height: '',
            transition: '',
            width: '0'
          });
          Object.assign(rightContainer.style, {
            height: '',
            transition: '',
            width: '0'
          });
        }
      }
    }

    get [symbols.template]() {
      return template.concat(super[symbols.template], template.html`
        <style>
          ::slotted(*) {
            box-sizing: border-box;
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

  };

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
