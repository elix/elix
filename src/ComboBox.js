import { apply, merge } from './updates.js';
import { getSuperProperty } from './workarounds.js';
import * as symbols from './symbols.js';
import * as template from './template.js';
import PopupSource from './PopupSource.js';


class ComboBox extends PopupSource {

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      horizontalAlign: 'stretch',
      sourceRole: 'div'
    });
  }

  get [symbols.template]() {
    // Next line is same as: const result = super[symbols.template]
    const result = getSuperProperty(this, ComboBox, symbols.template);

    // Use an input element in the source.
    const sourceSlot = result.content.querySelector('slot[name="source"]');
    if (!sourceSlot) {
      throw `Couldn't find slot with name "source".`;
    }
    const sourceSlotContent = template.html`
      <input id="input"></input>
      <div id="arrowContainer">
        <svg id="downIcon" xmlns="http://www.w3.org/2000/svg" width="10" height="5" viewBox="0 0 10 5">
          <path d="M 0 0 l5 5 5 -5 z"/>
        </svg>
        <svg id="upIcon" xmlns="http://www.w3.org/2000/svg" width="10" height="5" viewBox="0 0 10 5">
          <path d="M 0 5 l5 -5 5 5 z"/>
        </svg>
      </div>
    `;
    apply(sourceSlot, {
      childNodes: sourceSlotContent.content.childNodes
    });

    // HACK: Disable button styling
    // TODO: Refactor button out of PopupSource into PopupButton
    const styleTemplate = template.html`
      <style>
        #source {
          background: inherit;
          border-style: inherit;
          display: flex;
          padding: 0;
        }

        #arrowContainer {
          align-items: center;
          display: flex;
        }
      </style>
    `;
    result.content.appendChild(styleTemplate.content);

    return result;
  }

  // TODO: Refactor arrow stuff and share with MenuButton.
  get updates() {
    const popupPosition = this.state.popupPosition;
    // const itemRole = 'itemRole' in this.$.menu ? this.state.itemRole : null;
    // const clone = this.selectedItem ?
    //   this.selectedItem.cloneNode(true) :
    //   null;
    // const childNodes = clone ? clone.childNodes : [];
    return merge(super.updates, {
      $: {
        downIcon: {
          style: {
            display: popupPosition === 'below' ? 'block' : 'none',
            fill: 'currentColor',
            margin: '0.25em'
          }
        },
        // menu: Object.assign(
        //   {
        //     style: {
        //       padding: 0
        //     },
        //   },
        //   itemRole ? { itemRole } : null
        // ),
        popup: {
          style: {
            'flex-direction': 'column'
          }
        },
        upIcon: {
          style: {
            display: popupPosition === 'above' ? 'block' : 'none',
            fill: 'currentColor',
            margin: '0.25em'
          }
        },
        // value: {
        //   childNodes
        // }
      }
    });
  }

}


export default ComboBox;
customElements.define('elix-combo-box', ComboBox);
