import * as symbols from './symbols.js';
import * as template from './template.js';
import GenericMixin from './GenericMixin.js';
import ReactiveElement from './ReactiveElement.js';


const Base =
  GenericMixin(
    ReactiveElement
  );


/**
 * A choice in a menu
 * 
 * This class is a convenient way to popuplate a [Menu](Menu) with items that
 * exhibit an appearance roughly consistent with operating system menu items.
 * Use of this class is not required, however -- a `Menu` can contain any type
 * of item you want.
 * 
 * @inherits ReactiveElement
 * @mixes GenericMixin
 */
class MenuItem extends Base {

  [symbols.componentDidUpdate](/** @typeof {PlainObject} */ changed) {
    // TODO: How do we know whether to raise this if selection is set by Menu? */
    if (changed.selected /* && this[symbols.raiseChangeEvents] */) {
      /**
       * Raised when the `selected` property changes.
       * 
       * @event selected-changed
       */
      const event = new CustomEvent('selected-changed', {
        detail: {
          selected: this[symbols.state].selected
        }
      });
      this.dispatchEvent(event);
    }
  }

  get [symbols.defaultState]() {
    return Object.assign(super[symbols.defaultState], {
      selected: false
    });
  }

  [symbols.render](changed) {
    super[symbols.render](changed);
    if (changed.generic) {
      this.$.container.classList.toggle('generic', this[symbols.state].generic);
    }
  }

  get selected() {
    return this[symbols.state].selected;
  }
  set selected(selected) {
    this[symbols.setState]({
      selected
    });
  }

  get [symbols.template]() {
    /* Variety of system fonts */
    return template.html`
      <style>
        #container.generic {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          font-size: 10pt;
          padding-left: 2em !important;
          padding-right: 2em !important;
          white-space: nowrap;
        }
      </style>
      <div id="container">
        <slot></slot>
      </div>
    `;
  }
}


export default MenuItem;
customElements.define('elix-menu-item', MenuItem);
