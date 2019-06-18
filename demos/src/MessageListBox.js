import './AnimateAlignment.js';
import { applyChildNodes } from '../../src/utilities.js';
import * as symbols from '../../src/symbols.js';
import * as template from '../../src/template.js';
import SwipeableListBox from '../../src/SwipeableListBox.js';


export default class MessageListBox extends SwipeableListBox {

  get defaultState() {
    return Object.assign(super.defaultState, {
      generic: false
    });
  }

  [symbols.render](changed) {
    super[symbols.render](changed);
    if (changed.swipeItemIndex || changed.swipeFraction) {
      const swipeItem = this.getSwipeItemInState(this.state);
      if (swipeItem && 'read' in swipeItem) {
        const read = swipeItem.read;
        this.$.readIconWithLabel.style.display = read ? 'none' : '';
        this.$.unreadIconWithLabel.style.display = read ? '' : 'none';
      }
    }
    if (changed.swipeWillCommitLeft) {
      this.$.unreadCommand.align = this.state.swipeWillCommitLeft ?
        'right' :
        'left';
    }
    if (changed.swipeWillCommitRight) {
      this.$.deleteCommand.align = this.state.swipeWillCommitRight ?
        'left' :
        'right';
    }
  }

  get [symbols.template]() {
    const result = template.concat(super[symbols.template], template.html`
      <style>
        ::slotted(*) {
          line-height: 1.2em; /* Stabilizes height when line turns bold */
          padding: 0.5em 1em;
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
