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


export default class MessageListBox extends Base {

  get defaultState() {
    return Object.assign(super.defaultState, {
      swipeLeftFollowsThrough: true,
      swipeLeftRemovesItem: true
    });
  }

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
          selectedItem.read = !selectedItem.read;
        }
        handled = true;
        break;
    }

    // Prefer our result if it's defined, otherwise use base result.
    return handled || (super[symbols.keydown] && super[symbols.keydown](event)) || false;
  }

  [symbols.render](changed) {
    super[symbols.render](changed);
    if (changed.swipeItem || changed.swipeRightWillCommit) {
      const { swipeItem, swipeRightWillCommit } = this.state;
      if (swipeItem && 'read' in swipeItem) {
        const read = swipeItem.read;
        const newRead = swipeRightWillCommit ? !read : read;
        this.$.readIconWithLabel.style.display = newRead ? '' : 'none';
        this.$.unreadIconWithLabel.style.display = newRead ? 'none' : '';
      }
    }
    if (changed.swipeRightWillCommit) {
      this.$.unreadCommand.align = this.state.swipeRightWillCommit ?
        'right' :
        'left';
    }
    if (changed.swipeLeftWillCommit) {
      this.$.deleteCommand.align = this.state.swipeLeftWillCommit ?
        'left' :
        'right';
    }
  }

  // Wait until a left swipe has completed before excuting the Delete command.
  [symbols.swipeLeftComplete]() {
    if (super[symbols.swipeLeftComplete]) { super[symbols.swipeLeftComplete](); }
    this.state.swipeItem.remove();
  }

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

    // Patch unread command into left slot.
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

    // Patch delete command into right slot.
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