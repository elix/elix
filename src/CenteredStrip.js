import { merge } from './updates.js';
import * as symbols from './symbols.js';
import ClickSelectionMixin from './ClickSelectionMixin.js';
import ContentItemsMixin from './ContentItemsMixin.js';
import ElementBase from './ElementBase.js';
import FocusVisibleMixin from './FocusVisibleMixin.js';
// import LanguageDirectionMixin from './LanguageDirectionMixin.js';
import SingleSelectionMixin from './SingleSelectionMixin.js';
import SlotContentMixin from './SlotContentMixin.js';


const Base =
  ClickSelectionMixin(
  ContentItemsMixin(
  FocusVisibleMixin(
  // LanguageDirectionMixin(
  SingleSelectionMixin(
  SlotContentMixin(
    ElementBase
  )))));


class CenteredStrip extends Base {

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      selectionRequired: true
    });
  }

  get orientation() {
    return 'horizontal';
  }

  get [symbols.template]() {
    return `
      <style>
        :host {
          cursor: default;
          display: flex;
          -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        }

        #stripContainer {
          display: flex;
          flex: 1;
          overflow: hidden;
          position: relative;
        }

        #strip {
          display: inline-flex;
          transition: transform 0.25s;
        }
      </style>
      <div id="stripContainer" role="none">
        <div id="strip" role="none">
          <slot></slot>
        </div>
      </div>
    `;
  }

  get updates() {

    const selectedIndex = this.state.selectedIndex;
    const selectedItem = this.items && this.items[selectedIndex];
    let x; // The amount by which we'll shift content horizontally
    let justifyContent = '';
    if (selectedItem) {
      // @ts-ignore
      const stripContainerWidth = this.$.stripContainer.offsetWidth;
      // @ts-ignore
      const stripWidth = this.$.strip.offsetWidth;
      if (stripWidth > stripContainerWidth) {
        // @ts-ignore
        const itemLeft = selectedItem.offsetLeft;
        // @ts-ignore
        const itemWidth = selectedItem.offsetWidth;
        // Try to center the selected item.
        x = (stripContainerWidth - itemWidth) / 2 - itemLeft;
        // Constrain x to avoid showing space on either end.
        x = Math.min(x, 0);
        x = Math.max(x, stripContainerWidth - stripWidth);
      } else {
        justifyContent = 'center';
      }
    } else {
      x = 0;
    }
    const transform = `translateX(${x}px)`;

    return merge(super.updates, {
      $: {
        strip: {
          style: { transform }
        },
        stripContainer: {
          style: {
            'justify-content': justifyContent
          }
        }
      }
    });
  }

}


customElements.define('selection-strip', CenteredStrip);
export default CenteredStrip;
