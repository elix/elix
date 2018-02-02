import { merge } from '../../src/updates.js';
import * as symbols from '../../src/symbols.js';
import AriaListMixin from '../../src/AriaListMixin.js';
import ContentItemsMixin from '../../src/ContentItemsMixin.js';
import ElementBase from '../../src/ElementBase.js';
import LanguageDirectionMixin from '../../src/LanguageDirectionMixin.js';
import SingleSelectionMixin from '../../src/SingleSelectionMixin.js';
import SlotContentMixin from '../../src/SlotContentMixin.js';


const Base =
  AriaListMixin(
  ContentItemsMixin(
  LanguageDirectionMixin(
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
    const color = selected ? 'highlighttext' : original.style.color;
    const backgroundColor = selected ? 'highlight' : original.style['background-color'];
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
          overflow: hidden;
          -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        }

        #content {
          display: flex;
          flex-direction: row;
          flex: 1;
          transition: transform 0.25s;
        }
      </style>
      <div id="content" role="none">
        <slot></slot>
      </div>
    `;
  }

  get updates() {

    const selectedIndex = this.state.selectedIndex;
    const selectedItem = this.items && this.items[selectedIndex];
    let x; // The amount by which we'll shift content horizontally
    if (selectedItem) {
      const width = this.offsetWidth;
      // @ts-ignore
      const contentWidth = this.$.content.offsetWidth;
      // @ts-ignore
      const itemLeft = selectedItem.offsetLeft;
      // @ts-ignore
      const itemWidth = selectedItem.offsetWidth;
      // Try to center the selected item.
      x = (width - itemWidth) / 2 - itemLeft;
      // Constraint x to avoid showing space on either end.
      x = Math.min(x, 0);
      x = Math.max(x, width - contentWidth);
    } else {
      x = 0;
    }
    const transform = `translateX(${x}px)`;

    return merge(super.updates, {
      $: {
        content: {
          style: { transform }
        }
      }
    });
  }

}


customElements.define('selection-strip', SelectionStrip);
export default SelectionStrip;
