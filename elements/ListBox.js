import { formatStyle, mergeDeep, parseStyle } from '../mixins/helpers.js';
import { html } from '../node_modules/lit-html/lit-html.js';
import AttributeMarshallingMixin from '../mixins/AttributeMarshallingMixin.js';
import ClickSelectionMixin from '../mixins/ClickSelectionMixin.js';
import ContentItemsMixin from '../mixins/ContentItemsMixin.js';
import DefaultSlotContentMixin from '../mixins/DefaultSlotContentMixin.js';
import DirectionSelectionMixin from '../mixins/DirectionSelectionMixin.js';
import KeyboardDirectionMixin from '../mixins/KeyboardDirectionMixin.js';
import KeyboardMixin from '../mixins/KeyboardMixin.js';
import KeyboardPagedSelectionMixin from '../mixins/KeyboardPagedSelectionMixin.js';
import KeyboardPrefixSelectionMixin from '../mixins/KeyboardPrefixSelectionMixin.js';
import LitHtmlShadowMixin from '../mixins/LitHtmlShadowMixin.js';
import ReactiveMixin from '../mixins/ReactiveMixin.js';
import SelectionAriaMixin from '../mixins/SelectionAriaMixin.js';
import SelectionInViewMixin from '../mixins/SelectionInViewMixin.js';
import SingleSelectionMixin from '../mixins/SingleSelectionMixin.js';
import symbols from '../mixins/symbols.js';


const Base =
  AttributeMarshallingMixin(
  ClickSelectionMixin(
  ContentItemsMixin(
  DefaultSlotContentMixin(
  DirectionSelectionMixin(
  KeyboardDirectionMixin(
  KeyboardMixin(
  KeyboardPagedSelectionMixin(
  KeyboardPrefixSelectionMixin(
  LitHtmlShadowMixin(
  ReactiveMixin(
  SelectionAriaMixin(
  SelectionInViewMixin(
  SingleSelectionMixin(
    HTMLElement
  ))))))))))))));


/**
 * A simple single-selection list box.
 *
 * This component supports a generic visual style, ARIA support, and full
 * keyboard navigation. See `KeyboardDirectionMixin`,
 * `KeyboardPagedSelectionMixin`, and `KeyboardPrefixSelectionMixin` for
 * keyboard details.
 *
 * @extends {HTMLElement}
 * @mixes AttributeMarshallingMixin
 * @mixes ClickSelectionMixin
 * @mixes ContentItemsMixin
 * @mixes DefaultSlotContentMixin
 * @mixes DirectionSelectionMixin
 * @mixes KeyboardDirectionMixin
 * @mixes KeyboardMixin
 * @mixes KeyboardPagedSelectionMixin
 * @mixes KeyboardPrefixSelectionMixin
 * @mixes SelectedItemTextValueMixin
 * @mixes SelectionAriaMixin
 * @mixes SelectionInViewMixin
 * @mixes ShadowTemplateMixin
 * @mixes SingleSelectionMixin
 */
export default class ListBox extends Base {

  get defaultState() {
    return Object.assign({}, super.defaultState, {
      orientation: 'vertical'
    });
  }

  hostProps() {
    const base = super.hostProps && super.hostProps();
    const style = Object.assign(
      parseStyle(this),
      {
        'border': '1px solid gray',
        'box-sizing': 'border-box',
        'cursor': 'default',
        'display': 'flex',
        '-webkit-tap-highlight-color': 'rgba(0, 0, 0, 0)'
      }
    );
    return mergeDeep(base, { style });
  }

  itemProps(item, index) {
    const base = super.itemProps ? super.itemProps(item, index) : {};
    const selected = index === this.state.selectedIndex;
    const style = Object.assign(
      parseStyle(item),
      {
        'background': 'inherit',
        'color': 'inherit',
        'padding': '0.25em',
      },
      selected && {
        'background': 'highlight',
        'color': 'highlighttext'
      }
    );
    let className;
    if (selected) {
      className = `${base.class ? base.class + ' ' : ''}selected`;
    }
    return mergeDeep(base, {
      class: className,
      style
    });
  }

  get template() {
    const containerStyle = {
      'flex': '1',
      '-webkit-overflow-scrolling': 'touch', /* for momentum scrolling */
      'overflow-x': 'hidden',
      'overflow-y': 'scroll'
    };
    const template = html`
      <div id="itemsContainer" role="none" style=${formatStyle(containerStyle)}>
        <slot></slot>
      </div>
    `;
    return template;
  }

  get [symbols.scrollTarget]() {
    const root = this.shadowRoot || this;
    const itemsContainer = root.querySelector('#itemsContainer');
    return itemsContainer;
  }

}


customElements.define('elix-list-box', ListBox);
