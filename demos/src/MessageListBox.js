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
          padding: 0.25em;
        }

        .command {
          display: inline-flex;
          padding: 1em;
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

        @media (pointer: coarse) {
          #content ::slotted(*) {
            padding: 1em;
          }
        }
      </style>
    `);

    // Patch unread command into left slot.
    const leftCommandSlot = result.content.getElementById('leftCommandSlot');
    if (leftCommandSlot) {
      const leftCommandTemplate = template.html`
        <animate-alignment id="unreadCommand" slot="leftCommand" class="command">
          Read
        </animate-alignment>
      `;
      applyChildNodes(leftCommandSlot, leftCommandTemplate.content.childNodes);
    }

    // Patch delete command into right slot.
    const rightCommandSlot = result.content.getElementById('rightCommandSlot');
    if (rightCommandSlot) {
      const rightCommandTemplate = template.html`
        <animate-alignment id="deleteCommand" align="right" slot="rightCommand" class="command">
          Delete
        </animate-alignment>
      `;
      applyChildNodes(rightCommandSlot, rightCommandTemplate.content.childNodes);
    }

    return result;
  }

}


customElements.define('message-list-box', MessageListBox);
