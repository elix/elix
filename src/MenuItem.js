import * as internal from './internal.js';
import * as template from './template.js';
import GenericMixin from './GenericMixin.js';
import ReactiveElement from './ReactiveElement.js';

const Base = GenericMixin(ReactiveElement);

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
  [internal.componentDidUpdate](/** @typeof {PlainObject} */ changed) {
    // TODO: How do we know whether to raise this if selection is set by Menu? */
    if (changed.selected /* && this[internal.raiseChangeEvents] */) {
      /**
       * Raised when the `selected` property changes.
       *
       * @event selected-changed
       */
      const event = new CustomEvent('selected-changed', {
        detail: {
          selected: this[internal.state].selected
        }
      });
      this.dispatchEvent(event);
    }
  }

  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      selected: false
    });
  }

  get selected() {
    return this[internal.state].selected;
  }
  // Note: AttributeMarshallingMixin will recognize `selected` as the name of
  // attribute that should be parsed as a boolean attribute, and so will
  // handling parsing it for us.
  set selected(selected) {
    this[internal.setState]({ selected });
  }

  get [internal.template]() {
    /* Variety of system fonts */
    return template.html`
      <style>
        :host([generic]) {
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
