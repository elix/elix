import * as internal from './internal.js';
import * as template from './template.js';
import AriaRoleMixin from './AriaRoleMixin.js';
import ExpandablePanel from './ExpandablePanel.js';
import OpenCloseMixin from './OpenCloseMixin.js';
import ReactiveElement from './ReactiveElement.js';
import SeamlessButton from './SeamlessButton.js';

const Base = AriaRoleMixin(OpenCloseMixin(ReactiveElement));

/**
 * A document section with a header that can be expanded or collapsed
 *
 * @inherits ReactiveElement
 * @mixes AriaRoleMixin
 * @mixes OpenCloseMixin
 * @elementrole {SeamlessButton} header
 * @elementrole {ExpandablePanel} panel
 * @part collapse-icon - the icon shown when the panel is expanded
 * @part expand-icon - the icon shown when the panel is collapsed
 * @part header - the header that can be clicked/tapped to expand or collapse
 * the panel
 * @part panel - contains the component's expandable/collapsible content
 */
class ExpandableSection extends Base {
  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      headerRole: SeamlessButton,
      panelRole: ExpandablePanel,
      role: 'region'
    });
  }

  /**
   * The class, tag, or template used to create the clickable header.
   *
   * @type {Role}
   * @default SeamlessButton
   */
  get headerRole() {
    return this[internal.state].headerRole;
  }
  set headerRole(headerRole) {
    this[internal.setState]({ headerRole });
  }

  /**
   * The class, tag, or template used to create the expandable panel.
   *
   * @type {Role}
   * @default ExpandablePanel
   */
  get panelRole() {
    return this[internal.state].panelRole;
  }
  set panelRole(panelRole) {
    this[internal.setState]({ panelRole });
  }

  [internal.render](/** @type {PlainObject} */ changed) {
    super[internal.render](changed);
    if (changed.headerRole) {
      template.transmute(
        this[internal.ids].header,
        this[internal.state].headerRole
      );
      this[internal.ids].header.addEventListener('click', () => {
        this[internal.raiseChangeEvents] = true;
        this.toggle();
        this[internal.raiseChangeEvents] = false;
      });
    }
    if (changed.panelRole) {
      template.transmute(
        this[internal.ids].panel,
        this[internal.state].panelRole
      );
    }
    if (changed.opened) {
      const { opened } = this[internal.state];
      this[internal.ids].header.setAttribute(
        'aria-expanded',
        opened.toString()
      );
      if (this[internal.ids].collapseIcon) {
        this[internal.ids].collapseIcon.style.display = opened
          ? 'block'
          : 'none';
      }
      if (this[internal.ids].expandIcon) {
        this[internal.ids].expandIcon.style.display = opened ? 'none' : 'block';
      }
      if ('opened' in this[internal.ids].panel) {
        /** @type {any} */ (this[internal.ids].panel).opened = opened;
      }
    }
  }

  get [internal.template]() {
    // Default expand/collapse icons from Google's Material Design collection.
    return template.html`
      <style>
        :host {
          display: block;
        }

        #header {
          display: flex;
        }

        @media (hover: hover), (any-hover: hover) {
          #header:hover {
            background: rgba(0, 0, 0, 0.05);
          }
        }

        .headerElement {
          align-self: center;
        }

        #headerContainer {
          flex: 1;
          text-align: start;
        }

        #toggleContainer {
          margin: 0.5em;
        }
      </style>
      <div id="header" part="header">
        <div id="headerContainer" class="headerElement">
          <slot name="header"></slot>
        </div>
        <div id="toggleContainer" class="headerElement">
          <slot name="toggleSlot">
            <svg id="collapseIcon" part="collapse-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"/>
            </svg>
            <svg id="expandIcon" part="expand-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/>
            </svg>
          </slot>
        </div>
      </div>
      <div id="panel" part="panel" role="none">
        <slot></slot>
      </div>
    `;
  }
}

export default ExpandableSection;
