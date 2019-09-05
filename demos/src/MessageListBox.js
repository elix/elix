import './AnimateAlignment.js';
import { applyChildNodes } from '../../src/utilities.js';
import * as symbols from '../../src/symbols.js';
import * as template from '../../src/template.js';
import EffectMixin from '../../src/EffectMixin.js';
import ListBox from '../../src/ListBox.js';
import SwipeCommandsMixin from '../../src/SwipeCommandsMixin.js';
import TouchSwipeMixin from '../../src/TouchSwipeMixin.js';
import TrackpadSwipeMixin from '../../src/TrackpadSwipeMixin.js';


const Base =
  EffectMixin(
  SwipeCommandsMixin(
  TouchSwipeMixin(
  TrackpadSwipeMixin(
    ListBox
  ))));


/*
 * This demo shows how to create a list box with swipe commands behind the list
 * items for Mark Read/Unread (swipe right) and Delete (swipe left).
 */
export default class MessageListBox extends Base {

  get [symbols.defaultState]() {
    return Object.assign(super[symbols.defaultState], {
      // The Delete command removes an item, and we also want a swipe to Delete to
      // follow through: the leftward animation will continue all the way to the
      // left after the user completes the gesture.
      swipeLeftFollowsThrough: true,
      swipeLeftRemovesItem: true
    });
  }

  // To show how keyboard support can coexist with swipe commands, we define
  // the Space key as a shortcut for Mark Read/Unread and the Delete key as a
  // shortcut for the Delete command.
  [symbols.keydown](/** @type {KeyboardEvent} */ event) {
    let handled = false;
    const selectedItem = this.selectedItem;

    switch (event.key) {

      case 'Delete':
        if (selectedItem) {
          selectedItem.remove();
        }
        handled = true;
        break;
      
      case ' ':
        if (selectedItem && 'read' in selectedItem) {
          /** @type {any} */ const cast = selectedItem;
          cast.read = !cast.read;
        }
        handled = true;
        break;
    }

    // Prefer our result if it's defined, otherwise use base result.
    return handled || (super[symbols.keydown] && super[symbols.keydown](event)) || false;
  }

  [symbols.render](changed) {
    super[symbols.render](changed);

    // Our Mark Read/Unread command can show one of two different icons and
    // labels to indicate the read/unread state that will result if the user
    // ends the swipe at that point.
    if (changed.swipeItem || changed.swipeRightWillCommit) {
      const { swipeItem, swipeRightCommitted, swipeRightWillCommit } = this.state;
      if (swipeItem && 'read' in swipeItem) {
        const read = swipeItem.read;
        const newRead = swipeRightCommitted || swipeRightWillCommit ?
          !read :
          read;
        this.$.readIconWithLabel.style.display = newRead ? '' : 'none';
        this.$.unreadIconWithLabel.style.display = newRead ? 'none' : '';
      }
    }

    // Our swipe commands sit inside a little container that can animate the
    // transition between left and right alignment. We use this alignment to
    // signal the point at which releasing the swipe would commit the command.
    if (changed.swipeRightCommitted || changed.swipeRightWillCommit) {
      /** @type {any} */ (this.$.unreadCommand).align =
        this.state.swipeRightCommitted || this.state.swipeRightWillCommit ?
          'right' :
          'left';
    }
    if (changed.swipeLeftCommitted || changed.swipeLeftWillCommit) {
      /** @type {any} */ (this.$.deleteCommand).align =
        this.state.swipeLeftCommitted || this.state.swipeLeftWillCommit ?
          'left' :
          'right';
    }
  }

  // A swipe left indicates we should perform the Delete command. We want to
  // wait until the left swipe animation has completed before excuting the
  // deletion.
  [symbols.swipeLeftTransitionEnd]() {
    if (super[symbols.swipeLeftTransitionEnd]) { super[symbols.swipeLeftTransitionEnd](); }
    this.state.swipeItem.remove();
  }

  // A swipe right indicates we should toggle an item's read/unread state. We
  // toggle the state as soon as the swipe happens (before the item animates
  // back to its normal state).
  [symbols.swipeRight]() {
    const { swipeItem } = this.state;
    if ('read' in swipeItem) {
      swipeItem.read = !swipeItem.read;
    }
  }

  get [symbols.template]() {
    const result = template.concat(super[symbols.template], template.html`
      <style>
        #content.generic ::slotted(*) {
          padding: 0;
        }

        .command {
          display: flex;
          padding: 1em;
        }

        .iconWithLabel {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .icon {
          height: 32px;
          width: 32px;
        }

        #unreadCommand {
          background: #147efb;
          color: white;
          text-align: left;
        }
        #unreadCommand.willCommit {
          text-align: right;
        }

        #deleteCommand {
          background: #fc3d39;
          color: white;
          text-align: right;
        }
        #deleteCommand.willCommit {
          text-align: left;
        }
      </style>
    `);

    // Patch the Mark Read/Unread command into the left command slot.
    const leftCommandSlot = result.content.getElementById('leftCommandSlot');
    if (leftCommandSlot) {
      const leftCommandTemplate = template.html`
        <animate-alignment id="unreadCommand" slot="leftCommand" class="command">
          <div id="readIconWithLabel" class="iconWithLabel">
            <img class="icon" src="resources/outline-drafts-24px.svg">
            <div>Read</div>
          </div>
          <div id="unreadIconWithLabel" class="iconWithLabel">
            <img class="icon" src="resources/outline-markunread-24px.svg">
            <div>Unread</div>
          </div>
        </animate-alignment>
      `;
      applyChildNodes(leftCommandSlot, leftCommandTemplate.content.childNodes);
    }

    // Patch the Delete command into the right commands slot.
    const rightCommandSlot = result.content.getElementById('rightCommandSlot');
    if (rightCommandSlot) {
      const rightCommandTemplate = template.html`
        <animate-alignment id="deleteCommand" align="right" slot="rightCommand" class="command">
          <div class="iconWithLabel">
            <img class="icon" src="resources/outline-delete-24px.svg">
            <div>Delete</div>
          </div>
        </animate-alignment>
      `;
      applyChildNodes(rightCommandSlot, rightCommandTemplate.content.childNodes);
    }

    return result;
  }

}


customElements.define('message-list-box', MessageListBox);
