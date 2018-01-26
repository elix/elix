import { merge } from '../../src/updates.js';
import AriaListMixin from '../../src/AriaListMixin.js';
import ClickSelectionMixin from '../../src/ClickSelectionMixin.js';
import ContentItemsMixin from '../../src/ContentItemsMixin.js';
import DirectionSelectionMixin from '../../src/DirectionSelectionMixin.js';
import ElementBase from '../../src/ElementBase.js';
import FocusVisibleMixin from '../../src/FocusVisibleMixin.js';
import KeyboardDirectionMixin from '../../src/KeyboardDirectionMixin.js';
import KeyboardMixin from '../../src/KeyboardMixin.js';
import LanguageDirectionMixin from '../../src/LanguageDirectionMixin.js';
import SelectedItemTextValueMixin from '../../src/SelectedItemTextValueMixin.js';
import SingleSelectionMixin from '../../src/SingleSelectionMixin.js';
import SlotContentMixin from '../../src/SlotContentMixin.js';
import symbols from '../../src/symbols.js';


const Base =
  AriaListMixin(
  ClickSelectionMixin(
  ContentItemsMixin(
  DirectionSelectionMixin(
  FocusVisibleMixin(
  KeyboardDirectionMixin(
  KeyboardMixin(
  LanguageDirectionMixin(
  SelectedItemTextValueMixin(
  SingleSelectionMixin(
  SlotContentMixin(
    ElementBase
  )))))))))));


class ThumbnailsList1 extends Base {

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

        #content > ::slotted(option) {
          font-weight: inherit;
          min-height: inherit;
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
    let x;
    if (selectedItem) {
      const width = this.offsetWidth;
      const contentWidth = this.$.content.offsetWidth;
      const itemLeft = selectedItem.offsetLeft;
      const itemWidth = selectedItem.offsetWidth;
      // const midpoint = itemLeft + (itemWidth / 2);
      x = (width - itemWidth) / 2 - itemLeft;
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


customElements.define('thumbnail-list1', ThumbnailsList1);
export default ThumbnailsList1;
