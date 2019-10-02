import * as internal from './internal.js';
import * as template from './template.js';
import ReactiveElement from './ReactiveElement.js'; // eslint-disable-line no-unused-vars

/**
 * Reveals commands behind list items when the user swipes left or right
 *
 * @module SwipeCommandsMixin
 * @param {Constructor<ReactiveElement>} Base
 */
export default function SwipeCommandsMixin(Base) {
  // The class prototype added by the mixin.
  return class SwipeCommands extends Base {
    [internal.componentDidMount]() {
      if (super[internal.componentDidMount]) {
        super[internal.componentDidMount]();
      }
      // When a transition on the left/right command container ends, let the
      // component know so that it can perform any operation that should follow
      // the end of the transition. E.g., a Delete swipe command would want to
      // wait until the transition has finished before removing the item.
      this[internal.ids].leftCommandContainer.addEventListener(
        'transitionend',
        () => {
          if (
            this[internal.state].swipeRightCommitted &&
            this[internal.swipeRightTransitionEnd]
          ) {
            this[internal.swipeRightTransitionEnd]();
          }
          // Now that the swipe has finished, reset remaining swipe-related state.
          this[internal.setState]({
            swipeItem: null,
            swipeRightCommitted: false
          });
        }
      );
      this[internal.ids].rightCommandContainer.addEventListener(
        'transitionend',
        () => {
          if (
            this[internal.state].swipeLeftCommitted &&
            this[internal.swipeLeftTransitionEnd]
          ) {
            this[internal.swipeLeftTransitionEnd]();
          }
          // Now that the swipe has finished, reset remaining swipe-related state.
          this[internal.setState]({
            swipeItem: null,
            swipeLeftCommitted: false
          });
        }
      );
    }

    [internal.componentDidUpdate](/** @typeof {PlainObject} */ changed) {
      super[internal.componentDidUpdate](changed);
      // Vibrate if the user is currently swiping and has just triggered a change
      // in the commit-ability of a command.
      if (
        (changed.swipeLeftWillCommit || changed.swipeRightWillCommit) &&
        'vibrate' in navigator &&
        this[internal.state].swipeFraction !== null
      ) {
        navigator.vibrate(5);
      }
    }

    get [internal.defaultState]() {
      return Object.assign(super[internal.defaultState], {
        swipeLeftCommitted: false,
        swipeLeftFollowsThrough: false,
        swipeLeftRemovesItem: false,
        swipeRightCommitted: false,
        swipeRightFollowsThrough: false,
        swipeRightRemovesItem: false
      });
    }

    [internal.render](/** @type {PlainObject} */ changed) {
      super[internal.render](changed);
      if (changed.enableEffects || changed.swipeItem || changed.swipeFraction) {
        const { swipeItem, swipeFraction } = this[internal.state];
        const { leftCommandContainer, rightCommandContainer } = this[
          internal.ids
        ];
        const swiping = swipeFraction !== null;
        if (swipeItem && swiping) {
          // Currently swiping left/right on an item.
          const translation = swipeFraction * 100;

          // Get client rect of item using getBoundingClientRect so that we
          // get more precise fractional dimensions.
          const itemRect = swipeItem.getBoundingClientRect();

          // Subtract off the top of our offsetParent to effectively calculate
          // more accurate offsetTop.
          const offsetParent = swipeItem.offsetParent;
          const itemTop =
            itemRect.top - offsetParent.getBoundingClientRect().top;

          const commandWidth =
            Math.min(Math.abs(swipeFraction), 1) * itemRect.width;

          rightCommandContainer.style.transition = '';
          if (swipeFraction < 0) {
            // Swiping left: show right command container.
            Object.assign(rightCommandContainer.style, {
              height: `${itemRect.height}px`,
              top: `${itemTop}px`,
              width: `${commandWidth}px`
            });
          } else {
            rightCommandContainer.style.width = '0';
          }

          leftCommandContainer.style.transition = '';
          if (swipeFraction > 0) {
            // Swiping right: show left command container.
            Object.assign(leftCommandContainer.style, {
              height: `${itemRect.height}px`,
              top: `${itemTop}px`,
              width: `${commandWidth}px`
            });
          } else {
            leftCommandContainer.style.width = '0';
          }

          Object.assign(swipeItem.style, {
            height: `${itemRect.height}px`,
            transform: `translateX(${translation}%)`,
            transition: ''
          });
        } else if (swipeItem) {
          // User has finished active swiping, swipe item is still active. Let
          // item and command containers reset to normal state, or (if
          // requested, typically for a delete command) let them follow through.
          const {
            swipeLeftCommitted,
            swipeLeftFollowsThrough,
            swipeLeftRemovesItem,
            swipeRightCommitted,
            swipeRightFollowsThrough,
            swipeRightRemovesItem
          } = this[internal.state];
          const followThroughLeft =
            swipeLeftCommitted && swipeLeftFollowsThrough;
          const followThroughRight =
            swipeRightCommitted && swipeRightFollowsThrough;
          const containerTransition = 'height 0.25s, width 0.25s';
          Object.assign(leftCommandContainer.style, {
            transition: containerTransition,
            width: followThroughRight ? '100%' : '0'
          });
          Object.assign(rightCommandContainer.style, {
            transition: containerTransition,
            width: followThroughLeft ? '100%' : '0'
          });
          const translation = followThroughLeft
            ? '-100%'
            : followThroughRight
            ? '100%'
            : '0';
          if (swipeLeftCommitted && swipeLeftRemovesItem) {
            rightCommandContainer.style.height = '0';
          }
          if (swipeRightCommitted && swipeRightRemovesItem) {
            leftCommandContainer.style.height = '0';
          }
          const height =
            (swipeLeftCommitted && swipeLeftRemovesItem) ||
            (swipeRightCommitted && swipeRightRemovesItem)
              ? '0'
              : '';
          Object.assign(swipeItem.style, {
            height,
            transform: `translateX(${translation})`,
            transition: 'height 0.25s, transform 0.25s'
          });
        } else {
          // No item is being swiped. Reset command containers.
          Object.assign(leftCommandContainer.style, {
            height: '',
            transition: '',
            width: '0'
          });
          Object.assign(rightCommandContainer.style, {
            height: '',
            transition: '',
            width: '0'
          });
        }
      }
    }

    // If the user swipes left, we need to keep track of that fact -- we may
    // want to wait until after the animated swipe transition has completed to
    // do work, and by that point the original swipe state will have been reset.
    [internal.swipeLeft]() {
      if (super[internal.swipeLeft]) {
        super[internal.swipeLeft]();
      }
      this[internal.setState]({
        swipeLeftCommitted: true
      });
    }

    // See note for swipeLeft.
    [internal.swipeRight]() {
      if (super[internal.swipeRight]) {
        super[internal.swipeRight]();
      }
      this[internal.setState]({
        swipeRightCommitted: true
      });
    }

    [internal.swipeStart](clientX, clientY) {
      if (super[internal.swipeStart]) {
        super[internal.swipeStart](clientX, clientY);
      }
      // Determine which item is being swiped given the starting Y coordinate.
      const swipeItem = getItemAtY(this[internal.state].items, clientY);
      if (swipeItem) {
        this[internal.setState]({ swipeItem });
      }
    }

    get [internal.template]() {
      return template.concat(
        super[internal.template],
        template.html`
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

          #leftCommandContainer {
            left: 0;
          }

          #rightCommandContainer {
            right: 0;
          }
        </style>
        <div id="leftCommandContainer" class="commandContainer">
          <slot id="leftCommandSlot" name="leftCommand"></slot>
        </div>
        <div id="rightCommandContainer" class="commandContainer">
          <slot id="rightCommandSlot" name="rightCommand"></slot>
        </div>
      `
      );
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
