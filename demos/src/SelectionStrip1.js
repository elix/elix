import { merge } from '../../src/updates.js';
import * as symbols from '../../src/symbols.js';
import AriaListMixin from '../../src/AriaListMixin.js';
import ContentItemsMixin from '../../src/ContentItemsMixin.js';
import ElementBase from '../../src/ElementBase.js';
import FocusVisibleMixin from '../../src/FocusVisibleMixin.js';
// import LanguageDirectionMixin from '../../src/LanguageDirectionMixin.js';
import SingleSelectionMixin from '../../src/SingleSelectionMixin.js';
import SlotContentMixin from '../../src/SlotContentMixin.js';


const Base =
  AriaListMixin(
  ContentItemsMixin(
  FocusVisibleMixin(
  // LanguageDirectionMixin(
  SingleSelectionMixin(
  SlotContentMixin(
    ElementBase
  )))));


class SelectionStrip extends Base {

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      selectionRequired: true
    });
  }

  itemUpdates(item, calcs, original) {
    const base = super.itemUpdates ? super.itemUpdates(item, calcs, original) : {};
    const selected = calcs.selected;
    // const showSelection = selected && this.state.focusVisible;
    const showSelection = selected;
    const color = showSelection ? 'highlighttext' : original.style.color;
    const backgroundColor = showSelection ? 'highlight' : original.style['background-color'];
    return merge(base, {
      classes: {
        selected
      },
      style: {
        'background-color': backgroundColor,
        color,
        'padding': '0.25em'
      }
    });
  }

  get orientation() {
    return 'horizontal';
  }

  get [symbols.template]() {
    return `
      <style>
        :host {
          border: 1px solid gray;
          box-sizing: border-box;
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
          display: flex;
          flex-direction: row;
          flex: 1;
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
    if (selectedItem) {
      // @ts-ignore
      const stripContainerWidth = this.$.stripContainer.offsetWidth;
      // @ts-ignore
      const stripWidth = this.$.strip.offsetWidth;
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
      x = 0;
    }
    const transform = `translateX(${x}px)`;

    return merge(super.updates, {
      $: {
        strip: {
          style: { transform }
        }
      }
    });
  }

}


customElements.define('selection-strip', SelectionStrip);
export default SelectionStrip;
